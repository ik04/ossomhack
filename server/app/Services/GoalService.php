<?php

namespace App\Services;

use App\Models\Income;
use App\Models\Expense;
use App\Models\Loan;
use App\Models\Goal;
use App\Enums\Income as IncomeType;
use App\Enums\Expense as ExpenseType;

class GoalService
{
    private Goal $goal;

    public function __construct(Goal $goal)
    {
        $this->goal = $goal;
    }

    public function calculateTotalIncome(int $userId): array
    {
        $incomes = Income::where('user_id', $userId)->get();
        
        $breakdown = [
            'salary' => 0,
            'sidehustle' => 0,
            'business' => 0,
            'withdraw' => 0
        ];

        foreach ($incomes as $income) {
            switch ($income->type) {
                case IncomeType::SALARY:
                    $breakdown['salary'] += $income->amount;
                    break;
                case IncomeType::SIDEHUSTLE:
                    $breakdown['sidehustle'] += $income->amount;
                    break;
                case IncomeType::BUSINESS:
                    $breakdown['business'] += $income->amount;
                    break;
                case IncomeType::WITHDRAW:
                    $breakdown['withdraw'] += $income->amount;
                    break;
            }
        }

        return [
            'breakdown' => $breakdown,
            'total' => array_sum($breakdown)
        ];
    }

    public function calculateTotalExpenses(int $userId): array
    {
        $expenses = Expense::where('user_id', $userId)->get();
        
        $breakdown = [
            'daily' => 0,
            'weekly' => 0,
            'monthly' => 0
        ];

        foreach ($expenses as $expense) {
            switch ($expense->type) {
                case ExpenseType::DAILY:
                    $breakdown['daily'] += $expense->amount;
                    break;
                case ExpenseType::WEEKLY:
                    $breakdown['weekly'] += $expense->amount;
                    break;
                case ExpenseType::MONTHLY:
                    $breakdown['monthly'] += $expense->amount;
                    break;
            }
        }

        $total = 
            $breakdown['daily']  + 
            $breakdown['weekly']  + 
            $breakdown['monthly'];

        return [
            'breakdown' => $breakdown,
            'monthly_total' => $total
        ];
    }

    public function deductLoan(int $userId, float $savings): array
    {
        $unpaidLoans = Loan::where('user_id', $userId)
            ->where('is_paid', false)
            ->get();

        $totalEMI = 0;
        $loanBreakdown = [];

        foreach ($unpaidLoans as $loan) {
            $totalEMI += $loan->monthly_emi;
            $loanBreakdown[] = [
                'name' => $loan->name,
                'emi' => $loan->monthly_emi,
                'tenure_left' => $loan->tenure_left
            ];
        }

        return [
            'savings_after_emi' => $savings - $totalEMI,
            'total_emi' => $totalEMI,
            'loans' => $loanBreakdown
        ];
    }

    public function totalSavings(int $userId){
        $totalIncome = $this->calculateTotalIncome($userId);
        $totalExpenses = $this->calculateTotalExpenses($userId);
        $savings = $totalIncome['total'] - $totalExpenses['monthly_total'];
        $savingsAfterLoan = $this->deductLoan($userId,$savings);
        return $savingsAfterLoan['savings_after_emi'];
    }

    public function goalEqualModePortion(int $goalId): array
    {
        $goal = Goal::with('members')->findOrFail($goalId);
        $members = $goal->members;
        
        if ($members->count() === 0) {
            throw new \Exception('Goal must have at least one member');
        }

        $portion = $goal->amount / $members->count();
        $contributions = [];

        foreach ($members as $member) {
            $contributions[$member->user_id] = [
                'user_id' => $member->user_id,
                'amount' => $portion,
                'proportion' => 1 / $members->count()
            ];
        }

        return [
            'goal_amount' => $goal->amount,
            'total_contributors' => $members->count(),
            'contributions' => $contributions
        ];
    }

    public function goalSalaryModePortion(int $goalId): array
    {
        $goal = Goal::with(['members.user'])->findOrFail($goalId);
        $members = $goal->members;
        
        if ($members->isEmpty()) {
            throw new \Exception('Goal must have at least one member');
        }

        $totalSalaryPool = 0;
        $memberSalaries = [];

        foreach ($members as $member) {
            $salary = Income::where('user_id', $member->user_id)
                ->where('type', IncomeType::SALARY)
                ->sum('amount');
                
            if ($salary > 0) {
                $memberSalaries[$member->user_id] = [
                    'user_id' => $member->user_id,
                    'name' => $member->user->name,
                    'salary' => $salary
                ];
                $totalSalaryPool += $salary;
            }
        }

        if (empty($memberSalaries)) {
            throw new \Exception('No salary income found for any member');
        }

        $contributions = [];
        foreach ($memberSalaries as $userId => $memberData) {
            $proportion = $memberData['salary'] / $totalSalaryPool;
            $contributions[$userId] = [
                'user_id' => $userId,
                'name' => $memberData['name'],
                'salary' => $memberData['salary'],
                'amount' => $goal->amount * $proportion,
                'proportion' => $proportion
            ];
        }

        return [
            'goal_amount' => $goal->amount,
            'goal_name' => $goal->name,
            'total_contributors' => count($memberSalaries),
            'total_salary_pool' => $totalSalaryPool,
            'contributions' => $contributions
        ];
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Income;
use App\Models\Expense;
use App\Models\Loan;
use App\Models\Investment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function onboard(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'profile' => 'required|array',
                'profile.location' => 'required|string',
                'profile.occupation' => 'required|string',
                'profile.age' => 'required|integer',
                
                'incomes' => 'required|array',
                'incomes.*.name' => 'required|string',
                'incomes.*.amount' => 'required|numeric',
                'incomes.*.type' => 'required|integer',
                
                'expenses' => 'required|array',
                'expenses.*.name' => 'required|string',
                'expenses.*.amount' => 'required|numeric',
                'expenses.*.type' => 'required|integer',
                
                'loans' => 'array',
                'loans.*.principal' => 'required_with:loans|numeric',
                'loans.*.rate_of_interest' => 'required_with:loans|numeric',
                'loans.*.tenure' => 'required_with:loans|numeric',
                
                'investments' => 'array',
                'investments.*.principal' => 'required_with:investments|numeric',
                'investments.*.rate_of_interest' => 'required_with:investments|numeric',
                'investments.*.number_of_times' => 'required_with:investments|numeric',
                'investments.*.time' => 'required_with:investments|numeric',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $user = $request->user();
            
            // Create Profile
            $profile = Profile::create(array_merge(
                $request->profile,
                ['user_id' => $user->id]
            ));

            // Create Incomes
            foreach ($request->incomes as $income) {
                Income::create(array_merge(
                    $income,
                    ['user_id' => $user->id]
                ));
            }

            // Create Expenses
            foreach ($request->expenses as $expense) {
                Expense::create(array_merge(
                    $expense,
                    ['user_id' => $user->id]
                ));
            }

            // Create Loans if any
            if ($request->has('loans')) {
                foreach ($request->loans as $loan) {
                    Loan::create(array_merge(
                        $loan,
                        ['user_id' => $user->id]
                    ));
                }
            }

            // Create Investments if any
            if ($request->has('investments')) {
                foreach ($request->investments as $investment) {
                    Investment::create(array_merge(
                        $investment,
                        ['user_id' => $user->id]
                    ));
                }
            }

            // Update user onboarding status
            $user->update(['is_onboard' => true]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Profile created successfully',
                'data' => [
                    'profile' => $profile,
                    'user' => $user
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Profile creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

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
                // Profile validation
                'profile' => 'required|array',
                'profile.location' => 'required|string',
                'profile.occupation' => 'required|string',
                'profile.age' => 'required|integer',
                
                // Income validation
                'incomes' => 'required|array',
                'incomes.*.name' => 'required|string',
                'incomes.*.amount' => 'required|numeric',
                'incomes.*.type' => 'required|integer',
                
                // Expense validation
                'expenses' => 'required|array',
                'expenses.*.name' => 'required|string',
                'expenses.*.amount' => 'required|numeric',
                'expenses.*.type' => 'required|integer',
                
                // Loan validation
                'loans' => 'present|array',
                'loans.*.name' => 'required|string',
                'loans.*.amount' => 'required|numeric',
                'loans.*.monthly_emi' => 'required|numeric',
                'loans.*.tenure_left' => 'required|integer',
                'loans.*.is_paid' => 'required|boolean',
                
                // Investment validation
                'investments' => 'present|array',
                'investments.*.principal' => 'required|numeric',
                'investments.*.rate_of_interest' => 'required|numeric',
                'investments.*.compounding_frequency' => 'required|integer|min:0',
                'investments.*.time' => 'required|numeric',
                'investments.*.type' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Create Profile
            $profile = Profile::create([
                ...$request->profile,
                'user_id' => $request->user()->id
            ]);

            // Create Incomes
            foreach ($request->incomes as $income) {
                Income::create([
                    ...$income,
                    'user_id' => $request->user()->id
                ]);
            }

            // Create Expenses
            foreach ($request->expenses as $expense) {
                Expense::create([
                    ...$expense,
                    'user_id' => $request->user()->id
                ]);
            }

            // Create Loans
            if ($request->loans) {
                foreach ($request->loans as $loan) {
                    Loan::create([
                        ...$loan,
                        'user_id' => $request->user()->id
                    ]);
                }
            }

            // Create Investments
            if ($request->investments) {
                foreach ($request->investments as $investment) {
                    Investment::create([
                        ...$investment,
                        'user_id' => $request->user()->id
                    ]);
                }
            }

            // Update user onboarding status
            $request->user()->update(['is_onboard' => true]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Profile created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => false,
                'message' => 'Profile creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

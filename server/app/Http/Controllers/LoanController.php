<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Services\GoalService;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        try {
            $loans = Loan::where('user_id', $request->user()->id)->get();
            $goalService = new GoalService(new Goal());
            $loanDetails = $goalService->deductLoan($request->user()->id, 0);

            return response()->json([
                'status' => true,
                'loans' => $loans,
                'summary' => $loanDetails
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch loans',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'amount' => 'required|numeric',
                'monthly_emi' => 'required|numeric',
                'tenure_left' => 'required|integer',
                'is_paid' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $loan = Loan::create([
                ...$request->all(),
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Loan created successfully',
                'loan' => $loan
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Loan creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Loan $loan)
    {
        try {
            if ($loan->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'amount' => 'required|numeric',
                'monthly_emi' => 'required|numeric',
                'tenure_left' => 'required|integer',
                'is_paid' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $loan->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Loan updated successfully',
                'loan' => $loan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Loan update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Loan $loan, Request $request)
    {
        try {
            if ($loan->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $loan->delete();

            return response()->json([
                'status' => true,
                'message' => 'Loan deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Loan deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

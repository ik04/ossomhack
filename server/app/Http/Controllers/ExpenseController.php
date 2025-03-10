<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\GoalService;
use App\Models\Goal;
use App\Enums\Expense as ExpenseType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        try {
            $expenses = Expense::where('user_id', $request->user()->id)->get();
            $goalService = new GoalService(new Goal());
            $totals = $goalService->calculateTotalExpenses($request->user()->id);

            return response()->json([
                'status' => true,
                'expenses' => $expenses,
                'summary' => $totals
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch expenses',
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
                'type' => 'required|integer|in:0,1,2'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $expense = Expense::create([
                'name' => $request->name,
                'amount' => $request->amount,
                'type' => $request->type,
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Expense created successfully',
                'expense' => $expense
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Expense creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Expense $expense)
    {
        try {
            if ($expense->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'amount' => 'required|numeric',
                'type' => 'required|integer|in:0,1,2'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $expense->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Expense updated successfully',
                'expense' => $expense
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Expense update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Expense $expense, Request $request)
    {
        try {
            if ($expense->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $expense->delete();

            return response()->json([
                'status' => true,
                'message' => 'Expense deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Expense deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

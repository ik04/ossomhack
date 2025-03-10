<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Services\GoalService;
use App\Models\Goal;
use App\Enums\Income as IncomeType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $incomes = Income::where('user_id', $request->user()->id)->get();
            $goalService = new GoalService(new Goal());
            $totals = $goalService->calculateTotalIncome($request->user()->id);

            return response()->json([
                'status' => true,
                'incomes' => $incomes,
                'summary' => $totals
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch incomes',
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
                'type' => 'required|integer|in:0,1,2,3'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $income = Income::create([
                'name' => $request->name,
                'amount' => $request->amount,
                'type' => $request->type,
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Income created successfully',
                'income' => $income
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Income creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Income $income)
    {
        try {
            if ($income->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'amount' => 'required|numeric',
                'type' => 'required|integer|in:0,1,2,3'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $income->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Income updated successfully',
                'income' => $income
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Income update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Income $income, Request $request)
    {
        try {
            if ($income->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $income->delete();

            return response()->json([
                'status' => true,
                'message' => 'Income deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Income deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

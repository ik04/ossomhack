<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $investments = Investment::where('user_id', $request->user()->id)->get();
            
            $investmentsWithProfit = $investments->map(function($investment) {
                $finalAmount = $investment->principal * 
                    pow(1 + ($investment->rate_of_interest / 100) / $investment->compounding_frequency,
                        $investment->compounding_frequency * $investment->time);
                        
                return [
                    ...$investment->toArray(),
                    'profit' => $finalAmount - $investment->principal
                ];
            });

            return response()->json([
                'status' => true,
                'investments' => $investmentsWithProfit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch investments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'principal' => 'required|numeric',
                'rate_of_interest' => 'required|numeric',
                'compounding_frequency' => 'required|integer|min:0|max:3',
                'time' => 'required|numeric',
                'type' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $investment = Investment::create([
                ...$request->all(),
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Investment created successfully',
                'investment' => $investment
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Investment creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Investment $investment)
    {
        try {
            if ($investment->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'principal' => 'required|numeric',
                'rate_of_interest' => 'required|numeric',
                'compounding_frequency' => 'required|integer|min:0|max:3',
                'time' => 'required|numeric',
                'type' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $investment->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Investment updated successfully',
                'investment' => $investment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Investment update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Investment $investment, Request $request)
    {
        try {
            if ($investment->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $investment->delete();

            return response()->json([
                'status' => true,
                'message' => 'Investment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Investment deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

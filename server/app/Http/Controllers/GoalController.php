<?php

namespace App\Http\Controllers;

use App\Enums\GoalMode;
use App\Models\Goal;
use App\Models\GoalMember;
use App\Services\GoalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = Goal::whereHas('members', function($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->with('members')->get();

        return response()->json([
            'status' => true,
            'goals' => $goals
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                'amount' => 'required|numeric',
                'mode' => 'required|integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $goal = Goal::create([
                'title' => $request->title,
                'amount' => $request->amount,
                'mode' => $request->mode,
                'is_achieved' => false
            ]);

            GoalMember::create([
                'goal_id' => $goal->id,
                'user_id' => $request->user()->id
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Goal created successfully',
                'goal' => $goal->load('members')
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => false,
                'message' => 'Goal creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Goal $goal)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                'amount' => 'required|numeric',
                'mode' => 'required|integer',
                'is_achieved' => 'required|boolean',
                'members' => 'required|array',
                'members.*' => 'exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $goal->update($request->only(['title', 'amount', 'mode', 'is_achieved']));

            // Update members
            GoalMember::where('goal_id', $goal->id)->delete();
            
            foreach($request->members as $memberId) {
                GoalMember::create([
                    'goal_id' => $goal->id,
                    'user_id' => $memberId
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Goal updated successfully',
                'goal' => $goal->load('members')
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => false,
                'message' => 'Goal update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Goal $goal)
    {
        try {
            DB::beginTransaction();
            
            GoalMember::where('goal_id', $goal->id)->delete();
            $goal->delete();
            
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Goal deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => false,
                'message' => 'Goal deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchGoal(Request $request, $id)
    {
        try {
            $goal = Goal::with(['members.user'])->findOrFail($id);
            $goalService = new GoalService($goal);

            $portionDetails = $goal->mode === GoalMode::EQUAL 
                ? $goalService->goalEqualModePortion($id)
                : $goalService->goalSalaryModePortion($id);

            return response()->json([
                'status' => true,
                'goal' => [
                    'id' => $goal->id,
                    'name' => $goal->name,
                    'amount' => $goal->amount,
                    'mode' => $goal->mode,
                    'is_achieved' => $goal->is_achieved,
                    'created_at' => $goal->created_at
                ],
                'portions' => $portionDetails
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch goal details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

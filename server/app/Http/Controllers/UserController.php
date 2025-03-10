<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Exception;

class UserController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:255',
                'full_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string'
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = User::create([
                'username' => $request->username,  // Changed from $request->name
                'full_name' => $request->full_name,  
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
    
            $token = $user->createToken('token')->plainTextToken;
    
            return response()->json([
                'status' => true,
                'message' => 'User registered successfully',
                "token" => $token,
                'user' => $user
            ], 201)->cookie(
                'token',
                $token,
                60 * 24 * 30, // 30 days
                '/',
                null,
                true,
                true // httpOnly
            );
    
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'User registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'user' => $user,
            "token" => $token
        ], 200)->cookie(
            'token',
            $token,
            60 * 24 * 30,
            '/',
            null,
            true,
            true
        );
    }

    public function user(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'status' => true,
            'message' => 'Successfully logged out'
        ])->cookie(
            'token',
            null,
            -1
        );
    }
}

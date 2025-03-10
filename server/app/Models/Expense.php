<?php

namespace App\Models;

use App\Enums\Expense as ExpenseType;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'type',
        'user_id'
    ];

    protected $casts = [
        'amount' => 'float',
        'type' => ExpenseType::class
    ];
}

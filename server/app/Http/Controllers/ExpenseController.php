<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    protected $fillable = [
        "name",
        "amount",
        "type",
        "user_id"
    ];
}

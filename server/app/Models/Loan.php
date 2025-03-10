<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        "principal",
        "rate_of_interest",
        "tenure",
        "user_id"
    ];
}

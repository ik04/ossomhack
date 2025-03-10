<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        "name",
        "amount",
        "monthly_emi",
        "tenure_left",
        "is_paid",
        "user_id"
    ];
}

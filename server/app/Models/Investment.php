<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    protected $fillable = [
        "principal",
        "rate_of_interest",
        "number_of_times",
        "time",
        "user_id"
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    protected $fillable = [
        "principal",
        "rate_of_interest",
        "compounding_frequency",
        "time",
        "user_id",
        "type"
    ];
}

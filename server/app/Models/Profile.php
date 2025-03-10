<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        "income", // main income
        "expense",
        "location", // just have 3 mapped options for now 
        "occupation",
        "age",
        "user_id"
    ];
}

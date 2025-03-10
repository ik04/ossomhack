<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        "name",
        "amount",
        "mode",
        "is_achieved"
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoalMember extends Model
{
    protected $fillable = ['goal_id', 'user_id'];
}

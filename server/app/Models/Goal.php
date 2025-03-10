<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Goal extends Model
{
    protected $fillable = [
        "title",
        "amount",
        "mode",
        "is_achieved"
    ];

    public function members(): HasMany
    {
        return $this->hasMany(GoalMember::class);
    }
}

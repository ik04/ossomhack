<?php

namespace App\Models;

use App\Enums\Income as IncomeType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Income extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'type',
        'user_id'
    ];

    protected $casts = [
        'amount' => 'float',
        'type' => IncomeType::class
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

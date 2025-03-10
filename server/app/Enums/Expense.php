<?php

namespace App\Enums;

enum Expense:int {
    case DAILY = 0;
    case WEEKLY = 1;
    case MONTHLY = 2;
}
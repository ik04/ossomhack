<?php

namespace App\Enums;

enum CompoundingFrequency: int {
    case ANNUALLY = 0;
    case SEMIANNUALLY = 1;
    case QUARTERLY = 2;
    case MONTHLY = 3;
 
}
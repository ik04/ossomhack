<?php

namespace App\Enums;

enum Income:int
{
    case SALARY = 0;
    case SIDEHUSTLE = 1;
    case BUSINESS = 2;
    case WITHDRAW = 3;
    // map types in the frontend 
}
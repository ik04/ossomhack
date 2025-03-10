<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            // $table->float("income"); 
            // * send income separately from the incomes table, fetch total income or just salary for the llm
            // $table->float("expense");
            // * send expense separately from the expenses table, fetch total expenses from the table and send to naman's model after onboarding
            $table->string("location");
            $table->string("occupation");
            $table->integer("age");
            $table->unsignedBigInteger("user_id");
            $table->foreign("user_id")->references("id")->on('users')->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};

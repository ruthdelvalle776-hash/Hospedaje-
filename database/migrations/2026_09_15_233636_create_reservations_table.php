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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained('guests')->restrictOnDelete();
            $table->foreignId('room_id')->constrained('rooms')->restrictOnDelete();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->unsignedSmallInteger('number_of_people')->default(1);
            $table->decimal('price_per_person', 12, 2)->default(0);
            $table->unsignedSmallInteger('number_of_nights')->default(1);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('status', 30)->default('pendiente');
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->index(['room_id', 'check_in_date', 'check_out_date']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

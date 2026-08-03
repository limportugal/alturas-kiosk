<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kiosk_logos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image_path');
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
        });

        // Seed default logo record if initial default image exists
        DB::table('kiosk_logos')->insert([
            'name' => 'Default Legacy Logo',
            'image_path' => 'images/LegacyFurniture-removebg-preview(1).png',
            'status' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('kiosk_logos');
    }
};

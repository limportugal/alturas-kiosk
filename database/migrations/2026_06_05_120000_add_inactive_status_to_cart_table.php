<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ALTER COLUMN to add 'inactive' to the enum
        DB::statement("ALTER TABLE `cart` MODIFY `status` ENUM('active', 'inactive', 'confirmed', 'cancelled') NOT NULL DEFAULT 'active'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `cart` MODIFY `status` ENUM('active', 'confirmed', 'cancelled') NOT NULL DEFAULT 'active'");
    }
};

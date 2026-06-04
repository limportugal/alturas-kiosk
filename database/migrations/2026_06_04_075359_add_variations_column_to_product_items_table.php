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
        Schema::table('product_items', function (Blueprint $table) {
            $table->foreignId('variation_type_id')
                  ->nullable()
                  ->after('item_description')
                  ->constrained('product_variations')
                  ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_items', function (Blueprint $table) {
            // Drop variation_type_id FK if it exists (post-migration state)
            if (Schema::hasColumn('product_items', 'variation_type_id')) {
                $table->dropForeign(['variation_type_id']);
                $table->dropColumn('variation_type_id');
            }
            // Drop old string column if it exists (pre-migration state)
            if (Schema::hasColumn('product_items', 'variations')) {
                $table->dropColumn('variations');
            }
        });
    }
};

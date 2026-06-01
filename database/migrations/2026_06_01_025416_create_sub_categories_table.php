<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_category_id')
                  ->constrained('item_categories')
                  ->cascadeOnDelete();
            $table->string('name');
            $table->string('image_path')->nullable();
            $table->string('status')->default('Active');
            $table->timestamps();
        });

        // Add sub_category_id to product_items so a product can belong to a sub-category
        Schema::table('product_items', function (Blueprint $table) {
            $table->foreignId('sub_category_id')
                  ->nullable()
                  ->after('item_category_id')
                  ->constrained('sub_categories')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('product_items', function (Blueprint $table) {
            $table->dropForeign(['sub_category_id']);
            $table->dropColumn('sub_category_id');
        });

        Schema::dropIfExists('sub_categories');
    }
};

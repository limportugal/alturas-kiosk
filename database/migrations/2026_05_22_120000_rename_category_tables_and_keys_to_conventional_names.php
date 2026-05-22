<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('item_category') && !Schema::hasTable('item_categories')) {
            Schema::rename('item_category', 'item_categories');
        }

        if (Schema::hasTable('item_categories') && Schema::hasColumn('item_categories', 'category_name')) {
            Schema::table('item_categories', function (Blueprint $table) {
                $table->renameColumn('category_name', 'name');
            });
        }

        if (Schema::hasTable('product_items') && Schema::hasColumn('product_items', 'categoryId')) {
            Schema::table('product_items', function (Blueprint $table) {
                $table->renameColumn('categoryId', 'item_category_id');
            });
        }

        if (Schema::hasTable('product_items') && Schema::hasColumn('product_items', 'item_category_id')) {
            DB::statement('ALTER TABLE product_items MODIFY item_category_id BIGINT UNSIGNED NOT NULL');

            Schema::table('product_items', function (Blueprint $table) {
                $table->foreign('item_category_id')
                    ->references('id')
                    ->on('item_categories')
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('product_items') && Schema::hasColumn('product_items', 'item_category_id')) {
            Schema::table('product_items', function (Blueprint $table) {
                $table->dropForeign(['item_category_id']);
            });

            DB::statement('ALTER TABLE product_items MODIFY item_category_id VARCHAR(255) NOT NULL');

            Schema::table('product_items', function (Blueprint $table) {
                $table->renameColumn('item_category_id', 'categoryId');
            });
        }

        if (Schema::hasTable('item_categories') && Schema::hasColumn('item_categories', 'name')) {
            Schema::table('item_categories', function (Blueprint $table) {
                $table->renameColumn('name', 'category_name');
            });
        }

        if (Schema::hasTable('item_categories') && !Schema::hasTable('item_category')) {
            Schema::rename('item_categories', 'item_category');
        }
    }
};

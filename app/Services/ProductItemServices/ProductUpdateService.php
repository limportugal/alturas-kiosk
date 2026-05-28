<?php

namespace App\Services\ProductItemServices;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductItemImage;

class ProductUpdateService
{
    public function update(array $data, $id)
    {
        DB::beginTransaction();

        try {
            $product = ProductItemModel::findOrFail($id);

            // ── Update product fields (exclude images) ────────────────────
            $productData = collect($data)
                ->except(['images', 'removed_image_ids', 'existing_images'])
                ->toArray();

            $product->update($productData);

            // ── Remove specific images only (from removed_image_ids) ──────
            if (!empty($data['removed_image_ids'])) {
                $toRemove = ProductItemImage::whereIn('id', $data['removed_image_ids'])
                    ->where('product_item_id', $product->id)
                    ->get();

                foreach ($toRemove as $img) {
                    Storage::disk('public')->delete($img->image_path); // delete file
                    $img->delete(); // delete record
                }
            }

            // ── Add new images ─────────────────────────────────────────────
            if (!empty($data['images'])) {
                // Get current highest sort_order so new images append after existing
                $lastOrder = ProductItemImage::where('product_item_id', $product->id)
                    ->max('sort_order') ?? 0;

                // Check if there are any remaining images (for is_primary)
                $hasExisting = ProductItemImage::where('product_item_id', $product->id)
                    ->exists();

                foreach ($data['images'] as $index => $image) {
                    $path = $image->store('products', 'public');

                    ProductItemImage::create([
                        'product_item_id'  => $product->id,
                        'image_path'       => $path,
                        'is_primary'       => !$hasExisting && $index === 0, // primary only if no existing
                        'sort_order'       => $lastOrder + $index + 1,
                    ]);
                }
            }

            DB::commit();

            return $product->load('images');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
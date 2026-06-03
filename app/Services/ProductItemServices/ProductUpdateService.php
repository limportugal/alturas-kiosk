<?php

namespace App\Services\ProductItemServices;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductItemImage;
use App\Models\ProductItem\ProductColorVariant;

class ProductUpdateService
{
    public function update(array $data, $id)
    {
        DB::beginTransaction();

        try {
            $product = ProductItemModel::findOrFail($id);

            // ── Update product fields (exclude images + variants) ─────────
            $productData = collect($data)
                ->except(['images', 'removed_image_ids', 'existing_images', 'color_variants', 'removed_variant_ids'])
                ->toArray();

            $product->update($productData);

            // ── Remove specific images only (from removed_image_ids) ──────
            if (!empty($data['removed_image_ids'])) {
                $toRemove = ProductItemImage::whereIn('id', $data['removed_image_ids'])
                    ->where('product_item_id', $product->id)
                    ->get();

                foreach ($toRemove as $img) {
                //     Storage::disk('public')->delete($img->image_path); // delete file
                //    
                // }

                if (
                        $img->image_path &&
                        file_exists(public_path($img->image_path))
                    ) {
                        unlink(public_path($img->image_path));
                    }

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
                    // $path = $image->store('products', 'public');

                    $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

                    $image->move(
                        public_path('products'),
                        $fileName
                    );

                    $path = 'products/' . $fileName;

                    ProductItemImage::create([
                        'product_item_id'  => $product->id,
                        'image_path'       => $path,
                        'is_primary'       => !$hasExisting && $index === 0, // primary only if no existing
                        'sort_order'       => $lastOrder + $index + 1,
                    ]);
                }
            }

            // ── Remove specific color variants ────────────────────────────
            if (!empty($data['removed_variant_ids'])) {
                $toRemove = ProductColorVariant::whereIn('id', $data['removed_variant_ids'])
                    ->where('product_item_id', $product->id)
                    ->get();

                foreach ($toRemove as $variant) {
                    if ($variant->image_path) {
                       if (
                            $variant->image_path &&
                            file_exists(public_path($variant->image_path))
                        ) {
                            unlink(public_path($variant->image_path));
                        }
                    }
                    $variant->delete();
                }
            }

            // ── Add new color variants ────────────────────────────────────
            if (!empty($data['color_variants'])) {
                foreach ($data['color_variants'] as $variant) {
                    // Skip if it already has an id (existing variant, no change)
                    if (!empty($variant['id'])) continue;

                    $variantImagePath = null;
                    if (isset($variant['image_path']) && $variant['image_path'] instanceof \Illuminate\Http\UploadedFile) {
                        // $variantImagePath = $variant['image_path']->store('color-variants', 'public');

                        $file = $variant['image_path'];

                            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                            $file->move(
                                public_path('color-variants'),
                                $fileName
                            );

                            $variantImagePath = 'color-variants/' . $fileName;
                    }

                    ProductColorVariant::create([
                        'product_item_id' => $product->id,
                        'color_name'      => $variant['color_name'],
                        'image_path'      => $variantImagePath,
                    ]);
                }
            }

            DB::commit();

            return $product->load('images', 'colorVariants');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
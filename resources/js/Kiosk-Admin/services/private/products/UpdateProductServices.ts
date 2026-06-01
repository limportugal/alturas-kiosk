import { uploadApi } from '@/lib/axios';
import { route } from 'ziggy-js';
import { UpdateProductPayload } from '@/Kiosk-Admin/types/product-type';

export const UpdateProductServices = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateProductPayload;
}) => {
  const formData = new FormData();

  formData.append('_method',          'PUT');
  formData.append('item_code',        data.item_code);
  formData.append('name',             data.name);
  formData.append('sku',              data.sku);
  formData.append('item_category_id', String(data.item_category_id));
  if (data.sub_category_id) {
    formData.append('sub_category_id', String(data.sub_category_id));
  }
  formData.append('price',            data.price);
  formData.append('quantity',         data.quantity);
  formData.append('item_description', data.item_description);
  formData.append('status',           data.status);

  data.images.forEach((image) => {
    formData.append('images[]', image);
  });

  (data.removed_image_ids ?? []).forEach((imgId) => {
    formData.append('removed_image_ids[]', String(imgId));
  });

  // New color variants (no id = new)
  (data.color_variants ?? []).forEach((variant, i) => {
    formData.append(`color_variants[${i}][color_name]`, variant.color_name);
    if (variant.image_path instanceof File) {
      formData.append(`color_variants[${i}][image_path]`, variant.image_path);
    }
  });

  // Variant ids to remove
  (data.removed_variant_ids ?? []).forEach((variantId) => {
    formData.append('removed_variant_ids[]', String(variantId));
  });

  const response = await uploadApi.post(route('product.update-item', id), formData);
  return response.data;
};

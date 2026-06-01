import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { CreateProductPayload, ProductItem } from '@/Kiosk-Admin/types/product-type';

export const CreateProductServices = async (
  payload: CreateProductPayload
): Promise<{ message: string; data: ProductItem }> => {
  const formData = new FormData();

  formData.append('item_code',        payload.item_code);
  formData.append('name',             payload.name);
  formData.append('sku',              payload.sku);
  formData.append('item_category_id', String(payload.item_category_id));
  if (payload.sub_category_id) {
    formData.append('sub_category_id', String(payload.sub_category_id));
  }
  formData.append('price',            payload.price);
  formData.append('quantity',         payload.quantity);
  formData.append('item_description', payload.item_description);
  formData.append('status',           payload.status);

  payload.images.forEach((image) => {
    formData.append('images[]', image);
  });

  (payload.color_variants ?? []).forEach((variant, i) => {
    formData.append(`color_variants[${i}][color_name]`, variant.color_name);
    if (variant.image_path instanceof File) {
      formData.append(`color_variants[${i}][image_path]`, variant.image_path);
    }
  });

  const response = await api.post(route('products.store'), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

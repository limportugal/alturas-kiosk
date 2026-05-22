import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { CreateProductPayload, ProductItem} from '@/Kiosk-Admin/types/product-type';


export const CreateProductServices = async (
  payload: CreateProductPayload
): Promise<{ message: string; data: ProductItem }> => {
  const formData = new FormData();

  formData.append('item_code', payload.item_code);
  formData.append('name', payload.name);
  formData.append('sku', payload.sku);
  formData.append('categoryId', payload.categoryId);
  formData.append('price', payload.price);
  formData.append('quantity', payload.quantity);
  formData.append('item_description', payload.item_description);
  formData.append('status', payload.status);

  payload.images.forEach((image) => {
    formData.append('images[]', image);
  });

  const response = await api.post(route('products.store'), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
import { z } from 'zod';

export const ProductValidationSchema = z.object({
  item_code: z.string()
    .min(1, 'Item Code is required')
    .regex(/^[A-Z0-9-]+$/, 'Item Code must contain only uppercase letters, numbers, and hyphens'),

  name: z.string().min(1, 'Name is required'),

  sku: z.string()
    .min(1, 'SKU is required')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),

  quantity: z.string()
    .min(1, 'Quantity is required')
    .regex(/^\d+$/, 'Quantity must be a positive number'),
  // category_name: z.string().min(0, 'Category is required'),
  item_description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  item_category_id: z.number().min(1, 'Category is required'),
  images: z.string().min(1, 'Image is required'),

});


export type ProductTypeForm = z.infer<typeof ProductValidationSchema>;

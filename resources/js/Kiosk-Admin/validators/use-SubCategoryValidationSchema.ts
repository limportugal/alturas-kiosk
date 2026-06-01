import { z } from 'zod';

export const SubCategoryValidationSchema = z.object({
    item_category_id: z.number({ required_error: 'Category is required' }).min(1, 'Category is required'),
    name:             z.string().min(1, 'Name is required'),
    image_path:       z.instanceof(File, { message: 'Image is required' }),
});

export const SubCategoryUpdateValidationSchema = z.object({
    item_category_id: z.number({ required_error: 'Category is required' }).min(1, 'Category is required'),
    name:             z.string().min(1, 'Name is required'),
    image_path:       z.instanceof(File).optional().nullable(),
});

export type SubCategoryTypeForm       = z.infer<typeof SubCategoryValidationSchema>;
export type SubCategoryUpdateTypeForm = z.infer<typeof SubCategoryUpdateValidationSchema>;

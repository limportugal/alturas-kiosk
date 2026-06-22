import { z } from 'zod';

export const CategoryValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z
    .string()
    .optional()
    .or(z.literal('')),
    
  image_path: z.instanceof(File, {
    message: "Image is required"
  }),
});

export const CategoryUpdateValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_path: z.instanceof(File).optional().nullable(),
});

export type  CategoryTypeForm = z.infer<typeof CategoryValidationSchema>;
export type CategoryUpdateTypeForm = z.infer<typeof CategoryUpdateValidationSchema>;

import { z } from 'zod';

export const CategoryValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_path: z.instanceof(File, {
    message: "Image is required"
  }),
});

export type  CategoryTypeForm = z.infer<typeof CategoryValidationSchema>;
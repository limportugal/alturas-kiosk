import { z } from 'zod';

export const VariationValidationSchema = z.object({
    name:       z.string().min(1, 'Name is required'),
    image_path: z.instanceof(File, { message: 'Image is required' }),
    status:     z.string().min(1, 'Status is required'),
});

export const VariationUpdateValidationSchema = z.object({
    name:       z.string().min(1, 'Name is required'),
    image_path: z.instanceof(File).optional().nullable(),
    status:     z.string().min(1, 'Status is required'),
});

export type VariationTypeForm       = z.infer<typeof VariationValidationSchema>;
export type VariationUpdateTypeForm = z.infer<typeof VariationUpdateValidationSchema>;

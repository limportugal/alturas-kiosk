import { z } from 'zod';

export const AdsValidationSchema = z.object({
    title:      z.string().min(1, 'Title is required'),
    file_path:  z.instanceof(File, { message: 'File is required' }),
    sort_order: z.number().min(0, 'Sort order must be 0 or more'),
    duration:   z.number().min(3, 'Minimum 3 seconds').max(120, 'Maximum 120 seconds'),
    status:     z.string().min(1, 'Status is required'),
});

export const AdsUpdateValidationSchema = z.object({
    title:      z.string().min(1, 'Title is required'),
    file_path:  z.instanceof(File).optional().nullable(),
    sort_order: z.number().min(0),
    duration:   z.number().min(3).max(120),
    status:     z.string().min(1),
});

export type AdsForm       = z.infer<typeof AdsValidationSchema>;
export type AdsUpdateForm = z.infer<typeof AdsUpdateValidationSchema>;

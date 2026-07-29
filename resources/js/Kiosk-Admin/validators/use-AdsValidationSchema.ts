import { z } from 'zod';

const MAX_AD_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_AD_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4',
    'video/webm',
];

const adFileSchema = z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= MAX_AD_FILE_SIZE, 'File must not exceed 50 MB')
    .refine(
        (file) => ALLOWED_AD_FILE_TYPES.includes(file.type),
        'File must be a JPG, PNG, WebP, AVIF, MP4, or WebM',
    );

export const AdsValidationSchema = z.object({
    title:      z.string().min(1, 'Title is required'),
    file_path:  adFileSchema,
    sort_order: z.number().min(0, 'Sort order must be 0 or more'),
    duration:   z.number().min(3, 'Minimum 3 seconds').max(120, 'Maximum 120 seconds'),
    status:     z.string().min(1, 'Status is required'),
});

export const AdsUpdateValidationSchema = z.object({
    title:      z.string().min(1, 'Title is required'),
    file_path:  adFileSchema.optional().nullable(),
    sort_order: z.number().min(0),
    duration:   z.number().min(3).max(120),
    status:     z.string().min(1),
});

export type AdsForm       = z.infer<typeof AdsValidationSchema>;
export type AdsUpdateForm = z.infer<typeof AdsUpdateValidationSchema>;

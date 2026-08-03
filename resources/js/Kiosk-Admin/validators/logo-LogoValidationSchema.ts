import { z } from 'zod';

export const logoStoreSchema = z.object({
    name: z.string().min(1, 'Logo title/name is required').max(255, 'Title is too long'),
    status: z.enum(['Active', 'Inactive']),
});

export const logoUpdateSchema = z.object({
    name: z.string().min(1, 'Logo title/name is required').max(255, 'Title is too long'),
    status: z.enum(['Active', 'Inactive']),
});

export type LogoStoreTypeForm = z.infer<typeof logoStoreSchema>;
export type LogoUpdateTypeForm = z.infer<typeof logoUpdateSchema>;

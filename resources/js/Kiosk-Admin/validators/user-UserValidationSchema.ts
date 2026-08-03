import { z } from 'zod';

export const userStoreSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['super-admin', 'admin', 'staff']),
    status: z.enum(['Active', 'Inactive']),
    permissions: z.array(z.string()).optional(),
});

export const userUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().refine((val) => val === '' || val.length >= 8, {
        message: 'Password must be at least 8 characters',
    }).optional(),
    role: z.enum(['super-admin', 'admin', 'staff']),
    status: z.enum(['Active', 'Inactive']),
    permissions: z.array(z.string()).optional(),
});

export type UserStoreTypeForm = z.infer<typeof userStoreSchema>;
export type UserUpdateTypeForm = z.infer<typeof userUpdateSchema>;
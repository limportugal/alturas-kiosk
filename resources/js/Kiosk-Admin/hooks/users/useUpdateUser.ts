import { useMemo, useState, useEffect } from 'react';
import { ZodError } from 'zod';
import { userUpdateSchema, UserUpdateTypeForm } from '@/Kiosk-Admin/validators/user-UserValidationSchema';
import { UseUpdateUserMutations } from '@/Kiosk-Admin/hooks/mutation-hooks/usersMutation/useUpdateUserMutation';
import { UserListItem } from '@/Kiosk-Admin/types/user-types';

type FormErrors = Partial<Record<keyof UserUpdateTypeForm, string>>;

const mapBackendErrors = (backendErrors: Record<string, string[]>) => {
    const fieldErrors: FormErrors = {};

    Object.entries(backendErrors).forEach(([key, messages]) => {
        fieldErrors[key as keyof UserUpdateTypeForm] = messages[0];
    });

    return fieldErrors;
};

export const useUpdateUser = (user: UserListItem) => {
    const [form, setForm] = useState<UserUpdateTypeForm>({
        name: user.name,
        email: user.email,
        password: '',
        role: (user.role as 'super-admin' | 'admin' | 'staff') || 'staff',
        status: user.status.toLowerCase() === 'active' ? 'Active' : 'Inactive',
        permissions: user.permissions ?? [],
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        setForm({
            name: user.name,
            email: user.email,
            password: '',
            role: (user.role as 'super-admin' | 'admin' | 'staff') || 'staff',
            status: user.status.toLowerCase() === 'active' ? 'Active' : 'Inactive',
            permissions: user.permissions ?? [],
        });
    }, [user]);

    const updateUser = UseUpdateUserMutations({
        onSuccess: () => {
            setErrors({});
        },
    });

    const payload = useMemo(() => {
        const data: any = {
            ...form,
            permissions: form.role === 'staff' ? form.permissions ?? [] : [],
        };
        if (!form.password) {
            delete data.password;
        }
        return data;
    }, [form]);

    const setField = <K extends keyof UserUpdateTypeForm>(field: K, value: UserUpdateTypeForm[K]) => {
        setForm((prev) => {
            if (field === 'role') {
                return {
                    ...prev,
                    role: value as UserUpdateTypeForm['role'],
                    permissions: value === 'staff' ? prev.permissions ?? [] : [],
                };
            }

            return {
                ...prev,
                [field]: value,
            };
        });

        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const togglePermission = (permission: string) => {
        setForm((prev) => {
            const permissions = prev.permissions ?? [];
            const nextPermissions = permissions.includes(permission)
                ? permissions.filter((item) => item !== permission)
                : [...permissions, permission];

            return {
                ...prev,
                permissions: nextPermissions,
            };
        });

        setErrors((prev) => ({ ...prev, permissions: undefined }));
    };

    const validateForm = () => {
        try {
            userUpdateSchema.parse(payload);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};

                error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof UserUpdateTypeForm;
                    fieldErrors[fieldName] = issue.message;
                });

                setErrors(fieldErrors);
            }

            return false;
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        updateUser.mutate(
            { id: user.id, payload },
            {
                onError: (error: any) => {
                    const backendErrors = error?.response?.data?.errors;

                    if (backendErrors) {
                        setErrors(mapBackendErrors(backendErrors));
                    }
                },
            }
        );
    };

    return {
        form,
        errors,
        setErrors,
        setField,
        togglePermission,
        handleSubmit,
        validateForm,
        updateUser,
        isPending: updateUser.isPending,
        isSuccess: updateUser.isSuccess,
        isError: updateUser.isError,
        error: updateUser.error,
    };
};

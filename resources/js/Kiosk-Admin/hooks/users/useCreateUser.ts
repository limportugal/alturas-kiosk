import { useMemo, useState } from 'react';
import { ZodError } from 'zod';
import { userStoreSchema, UserStoreTypeForm } from '@/Kiosk-Admin/validators/user-UserValidationSchema';
import { UseCreateUserMutations } from '@/Kiosk-Admin/hooks/mutation-hooks/usersMutation/useCreateUserMutation';

type FormErrors = Partial<Record<keyof UserStoreTypeForm, string>>;

const initialForm: UserStoreTypeForm = {
    name: '',
    email: '',
    password: '',
    role: 'staff',
    status: 'Active',
    permissions: [],
};

const mapBackendErrors = (backendErrors: Record<string, string[]>) => {
    const fieldErrors: FormErrors = {};

    Object.entries(backendErrors).forEach(([key, messages]) => {
        fieldErrors[key as keyof UserStoreTypeForm] = messages[0];
    });

    return fieldErrors;
};

export const useCreateUser = () => {
    const [form, setForm] = useState<UserStoreTypeForm>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});

    const createUser = UseCreateUserMutations({
        onSuccess: () => {
            setForm(initialForm);
            setErrors({});
        },
    });

    const payload = useMemo(() => ({
        ...form,
        permissions: form.role === 'admin' ? [] : form.permissions ?? [],
    }), [form]);

    const setField = <K extends keyof UserStoreTypeForm>(field: K, value: UserStoreTypeForm[K]) => {
        setForm((prev) => {
            if (field === 'role') {
                return {
                    ...prev,
                    role: value as UserStoreTypeForm['role'],
                    permissions: value === 'admin' ? [] : prev.permissions ?? [],
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
            userStoreSchema.parse(payload);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};

                error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof UserStoreTypeForm;
                    fieldErrors[fieldName] = issue.message;
                });

                setErrors(fieldErrors);
            }

            return false;
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        createUser.mutate(payload, {
            onError: (error: any) => {
                const backendErrors = error?.response?.data?.errors;

                if (backendErrors) {
                    setErrors(mapBackendErrors(backendErrors));
                }
            },
        });
    };

    return {
        form,
        errors,
        setErrors,
        setField,
        togglePermission,
        handleSubmit,
        validateForm,
        createUser,
        isPending: createUser.isPending,
        isSuccess: createUser.isSuccess,
        isError: createUser.isError,
        error: createUser.error,
    };
};

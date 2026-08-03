import { useState } from 'react';
import { ZodError } from 'zod';
import { logoStoreSchema, LogoStoreTypeForm } from '@/Kiosk-Admin/validators/logo-LogoValidationSchema';
import { useCreateLogoMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/logoMutation/useCreateLogoMutation';

type FormErrors = Partial<Record<keyof LogoStoreTypeForm | 'image', string>>;

const initialForm: LogoStoreTypeForm = {
    name: '',
    status: 'Active',
};

export const useCreateLogo = () => {
    const [form, setForm] = useState<LogoStoreTypeForm>(initialForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const createLogo = useCreateLogoMutation({
        onSuccess: () => {
            setForm(initialForm);
            setImageFile(null);
            setErrors({});
        },
    });

    const setField = <K extends keyof LogoStoreTypeForm>(field: K, value: LogoStoreTypeForm[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validateForm = () => {
        const fieldErrors: FormErrors = {};

        try {
            logoStoreSchema.parse(form);
        } catch (error) {
            if (error instanceof ZodError) {
                error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof LogoStoreTypeForm;
                    fieldErrors[fieldName] = issue.message;
                });
            }
        }

        if (!imageFile) {
            fieldErrors.image = 'Logo image is required';
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm() || !imageFile) return;

        createLogo.mutate({
            name: form.name,
            status: form.status,
            image: imageFile,
        });
    };

    return {
        form,
        imageFile,
        setImageFile,
        errors,
        setField,
        handleSubmit,
        isPending: createLogo.isPending,
        isSuccess: createLogo.isSuccess,
    };
};

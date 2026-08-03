import { useState, useEffect } from 'react';
import { ZodError } from 'zod';
import { logoUpdateSchema, LogoUpdateTypeForm } from '@/Kiosk-Admin/validators/logo-LogoValidationSchema';
import { useUpdateLogoMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/logoMutation/useUpdateLogoMutation';
import { LogoList } from '@/Kiosk-Admin/types/logo-types';

type FormErrors = Partial<Record<keyof LogoUpdateTypeForm | 'image', string>>;

export const useUpdateLogo = (logo: LogoList) => {
    const [form, setForm] = useState<LogoUpdateTypeForm>({
        name: logo.name,
        status: logo.status,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        setForm({
            name: logo.name,
            status: logo.status,
        });
        setImageFile(null);
    }, [logo]);

    const updateLogo = useUpdateLogoMutation({
        onSuccess: () => {
            setErrors({});
        },
    });

    const setField = <K extends keyof LogoUpdateTypeForm>(field: K, value: LogoUpdateTypeForm[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validateForm = () => {
        try {
            logoUpdateSchema.parse(form);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};
                error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof LogoUpdateTypeForm;
                    fieldErrors[fieldName] = issue.message;
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        updateLogo.mutate({
            id: logo.id,
            payload: {
                name: form.name,
                status: form.status,
                image: imageFile,
            },
        });
    };

    return {
        form,
        imageFile,
        setImageFile,
        errors,
        setField,
        handleSubmit,
        isPending: updateLogo.isPending,
        isSuccess: updateLogo.isSuccess,
    };
};

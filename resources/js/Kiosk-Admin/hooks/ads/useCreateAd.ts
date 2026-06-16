import { useRef, useState } from 'react';
import { ZodError } from 'zod';
import { useAdsStore } from '@/Kiosk-Admin/hooks/zustands/use-store-ads';
import { useCreateAdMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/adsMutation/useCreateAdMutation';
import { AdsValidationSchema, AdsForm } from '@/Kiosk-Admin/validators/use-AdsValidationSchema';

type FormErrors = Partial<Record<keyof AdsForm, string>>;

export const useCreateAd = () => {
    const adsState = useAdsStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile]     = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const createAd = useCreateAdMutation({
        onSuccess: () => {
            adsState.resetForm();
            setFile(null);
            setErrors({});
        },
    });

    const validateForm = () => {
        try {
            AdsValidationSchema.parse({
                title:      adsState.title,
                file_path:  file,
                sort_order: adsState.sort_order,
                duration:   adsState.duration,
                status:     adsState.status,
            });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};
                error.issues.forEach((issue) => {
                    fieldErrors[issue.path[0] as keyof AdsForm] = issue.message;
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleFileChange = (files: FileList | null) => {
        const selected = files?.[0];
        if (!selected) return;
        setFile(selected);
        setErrors((prev) => ({ ...prev, file_path: undefined }));
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        createAd.mutate({
            title:      adsState.title,
            file_path:  file,
            sort_order: adsState.sort_order,
            duration:   adsState.duration,
            status:     adsState.status,
        });
    };

    return {
        handleSubmit, handleFileChange,
        file, setFile, errors,
        fileInputRef,
        isPending: createAd.isPending,
    };
};

import { useRef, useState, useEffect } from 'react';
import { ZodError } from 'zod';
import { useAdsStore } from '@/Kiosk-Admin/hooks/zustands/use-store-ads';
import { useEditAdMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/adsMutation/useEditAdMutation';
import { AdsUpdateValidationSchema, AdsUpdateForm } from '@/Kiosk-Admin/validators/use-AdsValidationSchema';
import { AdsList } from '@/Kiosk-Admin/types/ads-types';

type FormErrors = Partial<Record<keyof AdsUpdateForm, string>>;

export const useUpdateAd = (ad: AdsList | null) => {
    const adsState    = useAdsStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile]     = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const { mutate, isPending } = useEditAdMutation();

    useEffect(() => {
        if (!ad) return;
        adsState.setTitle(ad.title);
        adsState.setSortOrder(ad.sort_order);
        adsState.setDuration(ad.duration);
        adsState.setStatus(ad.status);
        setFile(null);
        setErrors({});
    }, [ad]);

    const validateForm = () => {
        try {
            AdsUpdateValidationSchema.parse({
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
                    fieldErrors[issue.path[0] as keyof AdsUpdateForm] = issue.message;
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
        if (!ad) return;
        if (!validateForm()) return;
        mutate({
            id: ad.id,
            data: {
                id:         ad.id,
                title:      adsState.title,
                file_path:  file,
                sort_order: adsState.sort_order,
                duration:   adsState.duration,
                status:     adsState.status,
            },
        });
    };

    return {
        handleSubmit, handleFileChange,
        file, setFile, errors,
        fileInputRef, isPending,
    };
};

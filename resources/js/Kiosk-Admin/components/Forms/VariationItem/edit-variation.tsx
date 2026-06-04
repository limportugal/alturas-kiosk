import { useEffect, useState } from 'react';
import { Button, Stack, TextField, MenuItem } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import { useUpdateVariation } from '@/Kiosk-Admin/hooks/variation/useUpdateVariation';
import { useVariationStore } from '@/Kiosk-Admin/hooks/zustands/use-store-variation';
import { VariationList } from '@/Kiosk-Admin/types/variation-types';

interface Props {
    variation: VariationList | null;
}

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

export default function EditVariation({ variation }: Props) {
    const [open, setOpen]             = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const variationState              = useVariationStore();

    const { handleSubmit, handleImageChange, handleRemoveImage, image, removeImage, errors, isPending } =
        useUpdateVariation(open ? variation : null);

    const handleClose = () => {
        setOpen(false);
        variationState.resetForm();
        setPreviewUrl(null);
    };

    useEffect(() => {
        if (!image) { setPreviewUrl(null); return; }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const existingImages =
        variationState.image_path && !removeImage
            ? [{ id: variation?.id, image_path: variationState.image_path }]
            : [];

    const previews = image && previewUrl ? [{ file: image, previewUrl }] : [];

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<EditOutlinedIcon />}
                size="small"
                sx={BTN_SX}
            >
                Edit
            </Button>

            <BaseModal open={open} onClose={handleClose} title="Edit Variation">
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Variation Name"
                        value={variationState.name ?? ''}
                        onChange={(e) => variationState.setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={INPUT_SX}
                    />

                    <TextField
                        select
                        label="Status"
                        value={variationState.status ?? 'Active'}
                        onChange={(e) => variationState.setStatus(e.target.value)}
                        error={!!errors.status}
                        helperText={errors.status}
                        sx={INPUT_SX}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    <ImageUploader
                        existingImages={existingImages}
                        onRemoveExisting={() => handleRemoveImage()}
                        previews={previews}
                        onRemoveNew={() => handleRemoveImage()}
                        onAdd={handleImageChange}
                        error={errors.image_path}
                        label="Variation Image"
                        multiple={false}
                        maxImages={1}
                        storagePath="/"
                    />

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSubmit}
                        disabled={isPending}
                        sx={BTN_SX}
                    >
                        {isPending ? 'Saving...' : 'Save Variation'}
                    </Button>
                </Stack>
            </BaseModal>
        </>
    );
}

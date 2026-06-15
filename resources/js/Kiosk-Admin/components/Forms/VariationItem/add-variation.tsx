import { useState, useEffect } from 'react';
import { Button, Stack, TextField, MenuItem } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import { useCreateVariation } from '@/Kiosk-Admin/hooks/variation/useCreateVariation';
import { useVariationStore } from '@/Kiosk-Admin/hooks/zustands/use-store-variation';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { getSubCategories } from '@/Kiosk-Admin/services/subcategory/dropdownSubCategoryServices';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

export default function AddVariation() {
    const [open, setOpen]             = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { handleSubmit, handleImageChange, image, setImage, errors, isPending } = useCreateVariation();
    const { name, setName, status, setStatus, sub_category_id, setSubCategoryId } = useVariationStore();

    const { data: subCategories } = useDynamicQuery(['sub-categories-dropdown'], getSubCategories);

    useEffect(() => {
        if (!image) { setPreviewUrl(null); return; }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleClose = () => {
        setOpen(false);
        setPreviewUrl(null);
    };

    return (
        <div>
            <Button
                variant="contained"
                sx={BTN_SX}
                startIcon={<AddBoxOutlinedIcon />}
                onClick={() => setOpen(true)}
            >
                Add Variation
            </Button>

            <BaseModal open={open} onClose={handleClose} title="Add New Variation">
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Variation Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={INPUT_SX}
                    />

                    {/* Sub-Category */}
                    <TextField
                        select
                        label="Sub-Category (optional)"
                        value={sub_category_id ?? ''}
                        onChange={(e) => setSubCategoryId(e.target.value ? Number(e.target.value) : null)}
                        sx={INPUT_SX}
                    >
                        <MenuItem value="">— None —</MenuItem>
                        {(subCategories ?? []).map((s) => (
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        error={!!errors.status}
                        helperText={errors.status}
                        sx={INPUT_SX}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    <ImageUploader
                        previews={
                            image && previewUrl
                                ? [{ file: image, previewUrl }]
                                : []
                        }
                        onAdd={handleImageChange}
                        onRemoveNew={() => { setImage(null); setPreviewUrl(null); }}
                        error={errors.image_path}
                        label="Variation Image"
                        multiple={false}
                        maxImages={1}
                    />

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSubmit}
                        disabled={isPending}
                        sx={BTN_SX}
                    >
                        {isPending ? 'Adding...' : 'Add Variation'}
                    </Button>
                </Stack>
            </BaseModal>
        </div>
    );
}

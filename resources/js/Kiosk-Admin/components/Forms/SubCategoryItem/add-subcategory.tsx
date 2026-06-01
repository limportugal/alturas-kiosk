import { useState, useEffect } from 'react';
import { Button, Stack, TextField, MenuItem } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import { useCreateSubCategory } from '@/Kiosk-Admin/hooks/subcategory/useCreateSubCategory';
import { useSubCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-subcategory';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { DropdownCategory } from '@/Kiosk-Admin/types/category-types';
import api from '@/lib/axios';
import { route } from 'ziggy-js';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

const fetchCategoryDropdown = async (): Promise<DropdownCategory[]> => {
    const response = await api.get(route('category'));
    return response.data;
};

export default function AddSubCategory() {
    const [open, setOpen]           = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { handleSubmit, handleImageChange, image, setImage, errors, isPending } = useCreateSubCategory();
    const { name, setName, item_category_id, setItem_category_id } = useSubCategoryStore();

    const { data: categories } = useDynamicQuery<DropdownCategory[]>(
        ['category-dropdown'],
        fetchCategoryDropdown
    );

    // Create/revoke object URL when image changes — same as add-category
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
                Add Sub-Category
            </Button>

            <BaseModal open={open} onClose={handleClose} title="Add New Sub-Category">
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        select
                        label="Category"
                        value={item_category_id || ''}
                        onChange={(e) => setItem_category_id(Number(e.target.value))}
                        error={!!errors.item_category_id}
                        helperText={errors.item_category_id}
                        sx={INPUT_SX}
                    >
                        {(categories ?? []).map((cat: DropdownCategory) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Sub-Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={INPUT_SX}
                    />

                    <ImageUploader
                        previews={
                            image && previewUrl
                                ? [{ file: image, previewUrl }]
                                : []
                        }
                        onAdd={handleImageChange}
                        onRemoveNew={() => { setImage(null); setPreviewUrl(null); }}
                        error={errors.image_path}
                        label="Sub-Category Image"
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
                        {isPending ? 'Adding...' : 'Add Sub-Category'}
                    </Button>
                </Stack>
            </BaseModal>
        </div>
    );
}

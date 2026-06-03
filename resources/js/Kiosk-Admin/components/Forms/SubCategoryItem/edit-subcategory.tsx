import { useEffect, useState } from 'react';
import { Button, Stack, TextField, MenuItem } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import { useUpdateSubCategory } from '@/Kiosk-Admin/hooks/subcategory/useUpdateSubCategory';
import { useSubCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-subcategory';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { DropdownCategory } from '@/Kiosk-Admin/types/category-types';
import api from '@/lib/axios';
import { route } from 'ziggy-js';

const fetchCategoryDropdown = async (): Promise<DropdownCategory[]> => {
    const response = await api.get(route('category'));
    return response.data;
};

interface Props {
    subCategory: SubCategoryList | null;
}

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

export default function EditSubCategory({ subCategory }: Props) {
    const [open, setOpen]           = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const subCategoryState          = useSubCategoryStore();

    const { handleSubmit, handleImageChange, handleRemoveImage, image, removeImage, errors, isPending } =
        useUpdateSubCategory(open ? subCategory : null);

    const { data: categories } = useDynamicQuery<DropdownCategory[]>(
        ['category-dropdown'],
        fetchCategoryDropdown
    );

    const handleClose = () => {
        setOpen(false);
        subCategoryState.resetForm();
        setPreviewUrl(null);
    };

    useEffect(() => {
        if (!image) { setPreviewUrl(null); return; }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const existingImages =
        subCategoryState.image_path && !removeImage
            ? [{ id: subCategory?.id, image_path: subCategoryState.image_path }]
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

            <BaseModal open={open} onClose={handleClose} title="Edit Sub-Category">
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        select
                        label="Category"
                        value={subCategoryState.item_category_id || ''}
                        onChange={(e) => subCategoryState.setItem_category_id(Number(e.target.value))}
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
                        value={subCategoryState.name ?? ''}
                        onChange={(e) => subCategoryState.setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={INPUT_SX}
                    />

                    <ImageUploader
                        existingImages={existingImages}
                        onRemoveExisting={() => handleRemoveImage()}
                        previews={previews}
                        onRemoveNew={() => handleRemoveImage()}
                        onAdd={handleImageChange}
                        error={errors.image_path}
                        label="Sub-Category Image"
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
                        {isPending ? 'Saving...' : 'Save Sub-Category'}
                    </Button>
                </Stack>
            </BaseModal>
        </>
    );
}

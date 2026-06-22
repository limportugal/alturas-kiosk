import { useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import { useUpdateCategory } from '@/Kiosk-Admin/hooks/category/useUpdateCategory';
import { useCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-category';
import { CategoryList } from '@/Kiosk-Admin/types/category-types';

interface Props {
  category: CategoryList | null;
}

export default function EditCategory({ category }: Props) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const categoryState = useCategoryStore();

  const {
    handleSubmit,
    handleImageChange,
    handleRemoveImage,
    image,
    removeImage,
    errors,
    isSuccess,
    isPending,
  } = useUpdateCategory(open ? category : null);

  const handleClose = () => {
    setOpen(false);
    categoryState.resetForm();
    setPreviewUrl(null);
  };

    useEffect(() => {
    if(isSuccess){
      handleClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(image);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [image]);

  const existingImages =
    categoryState.image_path && !removeImage
      ? [{ id: category?.id, image_path: categoryState.image_path }]
      : [];

  const previews =
    image && previewUrl
      ? [{ file: image, previewUrl }]
      : [];


  const INPUT_SX = {
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': { borderColor: '#7e22ce' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};


  const BTN_SX = {
  backgroundColor: '#7e22ce',
  '&:hover': { backgroundColor: '#6d28d9' },
};


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

      <BaseModal
        open={open}
        onClose={handleClose}
        title="Edit Category"
      >
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Category Name"
            value={categoryState.name ?? ''}
            onChange={(e) => categoryState.setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={INPUT_SX}
          />

          <TextField
            label="Description Name"
            value={categoryState.description ?? ''}
            onChange={(e) => categoryState.setDescription(e.target.value)}
            // error={!!errors.name}
            // helperText={errors.name}
              multiline
            fullWidth
            rows={4}
            sx={INPUT_SX}
          />
            <p className="text-sm text-yellow-600">
          Optional: Leaving this blank will also show a blank description on the kiosk.
         </p>

          <ImageUploader
            existingImages={existingImages}
            onRemoveExisting={() => handleRemoveImage()}
            previews={previews}
            onRemoveNew={() => handleRemoveImage()}
            onAdd={handleImageChange}
            error={errors.image_path}
            label="Category Image"
            multiple={false}
            maxImages={1}
            storagePath="/"
          />

          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={isPending}
             sx={{ ...BTN_SX }}
          >
            {isPending ? 'Saving...' : 'Save Category'}
          </Button>
        </Stack>
      </BaseModal>
    </>
  );
}

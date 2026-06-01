import { useState, useEffect } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import { useCreateCategory } from '@/Kiosk-Admin/hooks/category/useCreateCategory';
import { useCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-category';

const BTN_SX = {
  backgroundColor: '#7e22ce',
  '&:hover': { backgroundColor: '#6d28d9' },
};

export default function AddCategory() {
  const [open, setOpen]           = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { handleSubmit, handleImageChange, image, setImage, errors, isPending } = useCreateCategory();
  const { name, setName } = useCategoryStore();

  // Create/revoke object URL when image changes
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
        Add Category
      </Button>

      <BaseModal open={open} onClose={handleClose} title="Add New Category">
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <ImageUploader
            previews={image && previewUrl ? [{ file: image, previewUrl }] : []}
            onAdd={handleImageChange}
            onRemoveNew={() => { setImage(null); setPreviewUrl(null); }}
            error={errors.image_path}
            label="Category Image"
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
            {isPending ? 'Adding...' : 'Add Category'}
          </Button>
        </Stack>
      </BaseModal>
    </div>
  );
}

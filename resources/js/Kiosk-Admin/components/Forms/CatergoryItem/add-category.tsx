import { useState } from 'react';
import { Button, Stack, TextField, } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import  ImageUploader from '@/Kiosk-Admin/components/ImageUploader';


//from hooks to create
import { useCreateCategory } from '@/Kiosk-Admin/hooks/category/useCreateCategory';
import { useCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-category';


export default function AddCategory() {
     const [open, setOpen] = useState(false);

 const {
    handleSubmit,
    handleImageChange,
    image,
    errors,
    isPending,
  } = useCreateCategory();

    const {
      name,
      setName,
    } = useCategoryStore();


  return (
    <div>
      <Button
        variant="contained"
        startIcon={<AddBoxOutlinedIcon />}
        onClick={() => setOpen(true)}
      >
        Add Category
      </Button>

      <BaseModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Category"
      >
        <Stack spacing={2} sx={{mt:1}}>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

        <ImageUploader
            previews={
              image
                ? [{ file: image, previewUrl:URL.createObjectURL(image)}]
                : []
            }
            onAdd={handleImageChange}
            error={errors.image_path}
            label='Product Images'
            multiple={false}
          />

          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Adding...' : 'Add Category'}
          </Button>
        </Stack>
      </BaseModal>
    </div>
  );
}
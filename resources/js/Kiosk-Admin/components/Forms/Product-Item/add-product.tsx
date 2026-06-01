import { useState, useEffect } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import useDynamicQuery from '@/hooks/useDynamicQuery';

import { useCreateProduct } from '@/Kiosk-Admin/hooks/products/useCreateProduct';
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
import { getCategories } from '@/Kiosk-Admin/services/private/category/dropdownCategoryServices';
import { getSubCategories } from '@/Kiosk-Admin/services/private/subcategory/dropdownSubCategoryServices';
import ReusableSelect from '@/Kiosk-Admin/components/Buttons/dropdown';
import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import ColorVariantsEditor from '@/Kiosk-Admin/components/Forms/Product-Item/ColorVariantsEditor';

const INPUT_SX = {
  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
  backgroundColor: '#7e22ce',
  '&:hover': { backgroundColor: '#6d28d9' },
};

export default function AddProduct() {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    handleImageChange,
    removeNewImage,
    previews,
    colorVariants,
    addColorVariant,
    updateVariantName,
    updateVariantImage,
    removeColorVariant,
    errors,
    isPending,
  } = useCreateProduct();

  const {
    item_code, name, sku, item_category_id, sub_category_id,
    price, quantity, item_description,
    setItemCode, setName, setSku, setItemCategoryId, setSubCategoryId,
    setPrice, setQuantity, setItemDescriptions,
  } = useProductStore();

  const { data: categories }    = useDynamicQuery(['categories'], getCategories);
  const { data: subCategories } = useDynamicQuery(['sub-categories-dropdown'], getSubCategories);

  useEffect(() => {
    if (categories?.length) {
      setItemCategoryId(Number(categories[0].id));
    }
  }, [categories]);

  const categoryOptions = categories?.map((item) => ({ label: item.name, value: item.id })) ?? [];

  const subCategoryOptions = (subCategories ?? [])
    .filter((s) => s.item_category_id === item_category_id)
    .map((s) => ({ label: s.name, value: s.id }));

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={BTN_SX}
        startIcon={<AddBoxOutlinedIcon />}
      >
        Product Item
      </Button>

      <BaseModal open={open} title="Add Product" onClose={() => setOpen(false)} width={600}>
        <Stack spacing={2}>

          {/* Item Code + Name */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Item Code" fullWidth
              value={item_code ?? ''}
              onChange={(e) => setItemCode(e.target.value.toUpperCase())}
              error={!!errors.item_code} helperText={errors.item_code}
              sx={INPUT_SX}
            />
            <TextField
              label="Item Name" fullWidth
              value={name ?? ''}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name} helperText={errors.name}
              sx={INPUT_SX}
            />
          </Stack>

          {/* SKU + Category */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="SKU" fullWidth
              value={sku ?? ''}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              error={!!errors.sku} helperText={errors.sku}
              sx={INPUT_SX}
            />
            <ReusableSelect
              label="Category"
              value={item_category_id ?? ''}
              onChange={(value) => setItemCategoryId(Number(value))}
              options={categoryOptions}
            />
          </Stack>

          {/* Sub-Category */}
          <ReusableSelect
            label="Sub-Category (optional)"
            value={sub_category_id ?? ''}
            onChange={(value) => setSubCategoryId(value ? Number(value) : null)}
            options={[{ label: '— None —', value: '' }, ...subCategoryOptions]}
          />

          {/* Price + Quantity */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Price" type="number" fullWidth
              value={price ?? 0}
              onChange={(e) => setPrice(Number(e.target.value))}
              error={!!errors.price} helperText={errors.price}
              sx={INPUT_SX}
            />
            <TextField
              label="Quantity" type="number" fullWidth
              value={quantity ?? 0}
              onChange={(e) => setQuantity(Number(e.target.value))}
              error={!!errors.quantity} helperText={errors.quantity}
              sx={INPUT_SX}
            />
          </Stack>

          {/* Description */}
          <TextField
            label="Description" fullWidth multiline minRows={3}
            value={item_description}
            onChange={(e) => setItemDescriptions(e.target.value)}
            error={!!errors.item_description} helperText={errors.item_description}
            sx={INPUT_SX}
          />

          {/* Images */}
          <ImageUploader
            previews={previews}
            onRemoveNew={removeNewImage}
            onAdd={(files) =>
              handleImageChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>)
            }
            error={errors.images}
            label="Product Images"
            multiple
            maxImages={5}
          />

          {/* Color Variants */}
          <ColorVariantsEditor
            newVariants={colorVariants}
            onAdd={addColorVariant}
            onNameChange={updateVariantName}
            onImageChange={updateVariantImage}
            onRemoveNew={removeColorVariant}
          />

          <Button
            variant="contained"
            sx={{ ...BTN_SX, width: 150 }}
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Item'}
          </Button>

        </Stack>
      </BaseModal>
    </>
  );
}

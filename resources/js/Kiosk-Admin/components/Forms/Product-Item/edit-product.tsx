import { useState, useEffect } from 'react';
import {
  Button, TextField, Stack, Box,
  IconButton, Typography, Tooltip,
} from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import ReusableSelect from '@/Kiosk-Admin/components/Buttons/dropdown'; 

import useDynamicQuery from '@/hooks/useDynamicQuery';

import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
import { useUpdateProduct } from '@/Kiosk-Admin/hooks/products/useUpdateProduct';
import { ProductItem, ProductImage } from '@/Kiosk-Admin/types/product-type';

//to get categories use in dropdown
import { getCategories } from '@/Kiosk-Admin/services/category/dropdownCategoryServices';
import { getSubCategories } from '@/Kiosk-Admin/services/subcategory/dropdownSubCategoryServices';
import { getVariations } from '@/Kiosk-Admin/services/variation/dropdownVariationServices';

import ImageUploader from '@/Kiosk-Admin/components/ImageUploader';
import ColorVariantsEditor from '@/Kiosk-Admin/components/Forms/Product-Item/ColorVariantsEditor';

interface Props {
  product: (ProductItem & { images?: ProductImage[]; colorVariants?: ProductItem['color_variants'] }) | null;
}

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

export default function EditProduct({ product }: Props) {
  const [open, setOpen] = useState(false);
  const productState = useProductStore();

  const {setItemCategoryId, item_category_id, sub_category_id, setSubCategoryId, variation_type_id, setVariationTypeId} = useProductStore();

  const {
    errors,
    isPending,
    previews,
    existingImages,
    handleSubmit,
    handleImageChange,
    removeNewImage,
    removeExistingImage,
    existingVariants,
    newVariants,
    addNewVariant,
    updateNewVariantName,
    updateNewVariantImage,
    removeNewVariant,
    removeExistingVariant,
  } = useUpdateProduct(open ? product : null);

  const handleClose = () => {
    setOpen(false);
    productState.resetForm();
  };

    const { data: categories } = useDynamicQuery(['categories'], getCategories);
    const { data: subCategories } = useDynamicQuery(['sub-categories-dropdown'], getSubCategories);
    const { data: variations }    = useDynamicQuery(['variations-dropdown'], getVariations);

    useEffect(() => {
      if (categories?.length) {
        setItemCategoryId(Number(categories[0].id));
      }
    }, [categories]);
  
    const options = categories?.map((item) => ({ label: item.name, value: item.id })) ?? [];

    // Filter sub-categories by selected category
    const subCategoryOptions = (subCategories ?? [])
      .filter((s) => s.item_category_id === item_category_id)
      .map((s) => ({ label: s.name, value: s.id }));

    const variationOptions = (variations ?? [])
      .map((v) => ({ label: v.name, value: v.id }));

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={BTN_SX}
        startIcon={<EditOutlinedIcon />}
        size="small"
      >
        Edit
      </Button>

      <BaseModal
        open={open}
        title="Edit Product"
        onClose={handleClose}
        width={640}
      >
        <Stack spacing={2.5}>

          {/* Item Code + Name */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Item Code"
              fullWidth
              value={productState.item_code ?? ""}
              onChange={(e) => productState.setItemCode(e.target.value)}
              error={!!errors.item_code}
              helperText={errors.item_code}
              sx={INPUT_SX}
            />
            <TextField
              label="Item Name"
              fullWidth
              value={productState.name ?? ""}
              onChange={(e) => productState.setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={INPUT_SX}
            />
          </Stack>

          {/* SKU + Category */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="SKU"
              fullWidth
              value={productState.sku ?? ""}
              onChange={(e) => productState.setSku(e.target.value)}
              error={!!errors.sku}
              helperText={errors.sku}
              sx={INPUT_SX}
            />
             <ReusableSelect
                label="Category"
                value={item_category_id ?? ''}
                onChange={(value) => setItemCategoryId(Number(value))}
                options={options}
              />
          </Stack>  

          {/* Sub-Category */}
          <ReusableSelect
            label="Sub-Category (optional)"
            value={sub_category_id ?? ''}
            onChange={(value) => setSubCategoryId(value ? Number(value) : null)}
            options={[{ label: '— None —', value: '' }, ...subCategoryOptions]}
          />

          {/* Variation Type */}
          <ReusableSelect
            label="Variation Type (optional)"
            value={variation_type_id ?? ''}
            onChange={(value) => setVariationTypeId(value ? Number(value) : null)}
            options={[{ label: '— None —', value: '' }, ...variationOptions]}
          />

          {/* Price + Quantity */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={productState.price ?? ""}
              onChange={(e) => productState.setPrice(Number(e.target.value))}
              error={!!errors.price}
              helperText={errors.price}
              sx={INPUT_SX}
            />
            <TextField
              label="Quantity"
              fullWidth
              type="number"
              value={productState.quantity ?? ""}
              onChange={(e) => productState.setQuantity(Number(e.target.value))}
              error={!!errors.quantity}
              helperText={errors.quantity}
              sx={INPUT_SX}
            />
          </Stack>

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={productState.item_description ?? ""}
            onChange={(e) => productState.setItemDescriptions(e.target.value)}
            error={!!errors.item_description}
            helperText={errors.item_description}
            sx={INPUT_SX}
          />

          {/* ── Images Section ────────────────────────────────────── */}

          <ImageUploader
            existingImages={existingImages}
            onRemoveExisting={removeExistingImage}
            previews={previews}
            onRemoveNew={removeNewImage}
            onAdd={(files) =>
              handleImageChange({
                target: { files },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            error={errors.images}
            label='Product Images'
            storagePath="/"
          />

          {/* Color Variants */}
          <ColorVariantsEditor
            existingVariants={existingVariants}
            onRemoveExisting={removeExistingVariant}
            newVariants={newVariants}
            onAdd={addNewVariant}
            onNameChange={updateNewVariantName}
            onImageChange={updateNewVariantImage}
            onRemoveNew={removeNewVariant}
          />

          {/* Save button */}
          <Button
            variant="contained"
            sx={{ ...BTN_SX, width: 150 }}
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Item"}
          </Button>

        </Stack>
      </BaseModal>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import useDynamicQuery from '@/hooks/useDynamicQuery';

//from hooks to create
import { useCreateProduct } from '@/Kiosk-Admin/hooks/products/useCreateProduct';
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';

//to get categories use in dropdown
import { getCategories } from '@/Kiosk-Admin/services/private/category/dropdownCategoryServices';

//buttons
import ReusableSelect from '@/Kiosk-Admin/components/Buttons/dropdown'; 

export default function AddProduct() {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    handleImageChange,
    images,
    errors,
    fileInputRef,
    isPending,
  } = useCreateProduct();

  const {
    item_code,
    name,
    sku,
    item_category_id,
    price,
    quantity,
    item_description,
    status,
    setItemCode,
    setName,
    setSku,
    setItemCategoryId,
    setPrice,
    setQuantity,
    setItemDescriptions,
    setStatus,
  } = useProductStore();

  const { data: categories,
  }= useDynamicQuery(
    ['categories'], 
    getCategories
  );

  useEffect(() => {
    if(categories?.length) {
      setItemCategoryId(Number(categories[0].id));
    }
  }, [categories]);

  const options = 
      categories?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [];


  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: '#7e22ce',
          '&:hover': {
            backgroundColor: '#6d28d9',
          },
        }}
        startIcon={<AddBoxOutlinedIcon />}
      >
        Product Item
      </Button>

      <BaseModal
        open={open}
        title="Add Product"
        onClose={() => setOpen(false)}
        width={600}
      >
        <Stack spacing={2}>
          <TextField
            label="Item Code"
            fullWidth
            value={item_code ?? ''}
            onChange={(e) => setItemCode(e.target.value.toUpperCase())}
            error={!!errors.item_code}
            helperText={errors.item_code}
          />

          <TextField
            label="Item Name"
            fullWidth
            value={name ?? ''}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

  
          <ReusableSelect
            label="Category"
            value={item_category_id ?? ''}
            onChange={(value) => setItemCategoryId(Number(value))}
            options={options}
          />

          <TextField
            label="SKU"
            fullWidth
            value={sku ?? ''}
            onChange={(e) => setSku(e.target.value.toUpperCase())}
            error={!!errors.sku}
            helperText={errors.sku}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price ?? 0}
            onChange={(e) => setPrice(Number(e.target.value))}
            error={!!errors.price}
            helperText={errors.price}
          />

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity ?? 0}
            onChange={(e) => setQuantity(Number(e.target.value))}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={item_description}
            onChange={(e) => setItemDescriptions(e.target.value)}
            error={!!errors.item_description}
            helperText={errors.item_description}
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => handleImageChange(e.target.files)}
          />

          {errors.images && (
            <Typography color="error" sx={{ fontSize: 14 }}>
              {errors.images}
            </Typography>
          )}

          {images.length > 0 && (
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              {images.length} image(s) selected
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#7e22ce',
              '&:hover': {
                backgroundColor: '#6d28d9',
              },
              width: 150,
            }}
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

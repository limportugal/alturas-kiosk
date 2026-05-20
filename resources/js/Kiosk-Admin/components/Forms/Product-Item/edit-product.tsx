import { useState } from 'react';
import { Button, TextField, Stack } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

export default function EditProduct() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                  backgroundColor : '#7e22ce', 
                  '&:hover': {
                      backgroundColor : '#6d28d9',
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
          <TextField label="Item Name" fullWidth />
          <TextField label="Category" fullWidth />
          <TextField label="SKU" fullWidth />
          <TextField label="Price" type="number" fullWidth />

          <Button 
              variant="contained"
              sx={{
                  backgroundColor : '#7e22ce', 
                  '&:hover': {
                      backgroundColor : '#6d28d9',
                  },
                  width: 150,
              }}
           
              startIcon={<SaveOutlinedIcon/>}
              >
            Save Item
          </Button>
        </Stack>
      </BaseModal>
    </>
  );
}
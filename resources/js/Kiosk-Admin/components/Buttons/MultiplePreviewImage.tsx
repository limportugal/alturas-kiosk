import { useMemo, useState } from 'react';
import { Box, Dialog, DialogContent, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProductImage } from '@/Kiosk-Admin/types/product-type';

interface Props {
  images?: ProductImage[];
  productName: string;
}

export default function MultiplePreviewImage({
  images = [],
  productName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [images]);

  const selectedImage = sortedImages[selectedIndex];

  if (!sortedImages.length) {
    return <span>No Image</span>;
  }

 const toImageUrl = (path?: string) =>
  !path ? '' : path.startsWith('/') || path.startsWith('http') ? path : `/${path}`;

  return (
    <>
      <Box
        component="img"
        src={toImageUrl(sortedImages[0]?.image_path)}
        alt={productName}
        onClick={() => {
          setSelectedIndex(0);
          setOpen(true);
        }}
        sx={{
          width: 48,
          height: 48,
          objectFit: 'cover',
          borderRadius: 1,
          cursor: 'pointer',
          border: '1px solid #e5e7eb',
        }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogContent
          sx={{
            backgroundColor: '#ffffffff',
            minHeight: '75vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#fff',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Box
              component="img"
              src={`/${selectedImage.image_path}`}
              alt={productName}
              sx={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: 'auto',
              justifyContent: 'center',
              py: 1,
            }}
          >
            {sortedImages.map((image, index) => (
              <Box
                key={image.id ?? index}
                component="img"
                src={`/${image.image_path}`}
                alt={`${productName}-${index}`}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  width: 92,
                  height: 92,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: selectedIndex === index
                    ? '2px solid #7e22ce'
                    : '1px solid #d1d5db',
                }}
              />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
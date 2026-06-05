import { useState } from 'react';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  imagePath?: string;
  alt: string;
}

export default function ImagePreviewCell({ imagePath, alt }: Props) {
  const [open, setOpen] = useState(false);

  if (!imagePath) {
    return <span>No Image</span>;
  }

  const imageUrl =
    imagePath.startsWith('/') || imagePath.startsWith('http')
      ? imagePath
      : `/${imagePath}`;

  return (
    <>
      <Box
        component="img"
        src={imageUrl}
        alt={alt}
        onClick={() => setOpen(true)}
        sx={{
          width: 48,
          height: 48,
          objectFit: 'cover',
          borderRadius: 1,
          cursor: 'pointer',
          border: '1px solid #e5e7eb',
        }}
      />

     <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        >
        <DialogContent
            sx={{
            position: 'relative',
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fffefeff',
            minHeight: '50vh',
            }}
        >
            <IconButton
            onClick={() => setOpen(false)}
            sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 1,
            }}
            >
            <CloseIcon />
            </IconButton>

            <Box
            component="img"
            src={imageUrl}
            alt={alt}
            sx={{
                width: '100%',
                maxWidth: '900px',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 1,
            }}
            />
        </DialogContent>
        </Dialog>
    </>
  );
}

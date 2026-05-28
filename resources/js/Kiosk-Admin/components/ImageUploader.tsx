import { useRef } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ExistingImage {
  id?: number;          // ← optional para match sa ProductImage
  image_path: string;
  is_primary?: boolean;
}

export interface ImagePreview {
  file: File;
  previewUrl: string;
}

interface ImageUploaderProps {
  // Existing images from DB
  existingImages?: ExistingImage[];
  onRemoveExisting?: (id: number) => void;

  // New image previews
  previews?: ImagePreview[];
  onRemoveNew?: (index: number) => void;
  onAdd?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Config
  multiple?: boolean;
  maxImages?: number;
  label?: string;
  error?: string;

  // Storage base path (e.g. '/storage/' or 'https://cdn.example.com/')
  storagePath?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ImageUploader({
  existingImages = [],
  onRemoveExisting,
  previews = [],
  onRemoveNew,
  onAdd,
  multiple = true,
  maxImages,
  label = 'Product Images',
  error,
  storagePath = '/storage/',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImages = existingImages.length + previews.length;
  const isMaxReached = maxImages !== undefined && totalImages >= maxImages;

  return (
    <Box>
      {/* Label */}
      {label && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: 'block', fontWeight: 500 }}
        >
          {label}
          {maxImages && (
            <span style={{ marginLeft: 6, opacity: 0.6 }}>
              ({totalImages}/{maxImages})
            </span>
          )}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>

        {/* ── Existing images from DB ── */}
        {existingImages.map((img) => (
          <ImageThumb
            key={`existing-${img.id}`}
            src={`${storagePath}${img.image_path}`}
            isPrimary={img.is_primary}
            badge={img.is_primary ? 'Primary' : undefined}
            badgeColor="rgba(16,185,129,0.8)"
            onRemove={
              onRemoveExisting && img.id !== undefined
                ? () => onRemoveExisting(img.id!)
                : undefined
            }
          />
        ))}

        {/* ── New image previews ── */}
        {previews.map((preview, index) => (
          <ImageThumb
            key={`new-${index}`}
            src={preview.previewUrl}
            badge="New"
            badgeColor="rgba(126,34,206,0.75)"
            onRemove={onRemoveNew ? () => onRemoveNew(index) : undefined}
          />
        ))}

        {/* ── Add photo button ── */}
        {!isMaxReached && (
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              width: 90, height: 90,
              borderRadius: 2,
              border: '1.5px dashed',
              borderColor: error ? 'error.main' : '#7e22ce',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: error ? 'error.main' : '#7e22ce',
              gap: 0.5,
              transition: 'background 0.15s',
              '&:hover': {
                background: error ? '#fff5f5' : '#faf5ff',
              },
            }}
          >
            <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 22 }} />
            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 500 }}>
              Add Photo
            </Typography>
          </Box>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => {
            onAdd?.(e);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />
      </Box>

      {/* Error message */}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

// ─── ImageThumb — single image tile ──────────────────────────────────────────
interface ImageThumbProps {
  src: string;
  badge?: string;
  badgeColor?: string;
  isPrimary?: boolean;
  onRemove?: () => void;
}

function ImageThumb({ src, badge, badgeColor, onRemove }: ImageThumbProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 90, height: 90,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1.5px solid',
        borderColor: badge === 'New' ? '#7e22ce' : 'divider',
        flexShrink: 0,
      }}
    >
      {/* Image */}
      <img
        src={src}
        alt="product"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Remove button */}
      {onRemove && (
        <Tooltip title="Remove">
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{
              position: 'absolute', top: 2, right: 2,
              background: 'rgba(0,0,0,0.55)',
              color: 'white', p: '2px',
              '&:hover': { background: '#dc2626' },
            }}
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Badge — "New", "Primary", etc. */}
      {badge && (
        <Box
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: badgeColor ?? 'rgba(0,0,0,0.5)',
            color: 'white',
            fontSize: 9, fontWeight: 600,
            textAlign: 'center', py: '2px',
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
}
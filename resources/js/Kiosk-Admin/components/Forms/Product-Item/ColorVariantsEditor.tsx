import { useRef } from 'react';
import {
  Box, Button, IconButton, Stack,
  TextField, Tooltip, Typography,
} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ProductColorVariant, NewColorVariant } from '@/Kiosk-Admin/types/product-type';

const INPUT_SX = {
  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

// ── Existing variant row (from DB) ────────────────────────────────────────────
interface ExistingVariantRowProps {
  variant: ProductColorVariant;
  onRemove: (id: number) => void;
}

export function ExistingVariantRow({ variant, onRemove }: ExistingVariantRowProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', maxWidth: 520 }}>
      {/* Image preview */}
      <Box
        sx={{
          width: 56, height: 56, borderRadius: 1.5,
          overflow: 'hidden', border: '1.5px solid #e0dbd5',
          flexShrink: 0, background: '#f5f2ee',
        }}
      >
        {variant.image_path ? (
          <img
            src={`/storage/${variant.image_path}`}
            alt={variant.color_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            🎨
          </Box>
        )}
      </Box>

      {/* Color name (read-only for existing) */}
      <TextField
        label="Color Name"
        value={variant.color_name}
        size="small"
        sx={{ ...INPUT_SX, width: 160 }}
        slotProps={{ input: { readOnly: true } }}
      />

      {/* Remove */}
      <Tooltip title="Remove variant">
        <IconButton
          onClick={() => onRemove(variant.id)}
          sx={{ color: '#dc2626', '&:hover': { background: '#fee2e2' } }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}


// ── New variant row (being added) ─────────────────────────────────────────────
interface NewVariantRowProps {
  variant: NewColorVariant;
  index: number;
  onNameChange: (index: number, name: string) => void;
  onImageChange: (index: number, file: File | null) => void;
  onRemove: (index: number) => void;
}

export function NewVariantRow({ variant, index, onNameChange, onImageChange, onRemove }: NewVariantRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', maxWidth: 520 }}>
      {/* Image thumb / picker */}
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          width: 56, height: 56, borderRadius: 1.5,
          overflow: 'hidden', border: '1.5px dashed #7e22ce',
          flexShrink: 0, background: '#faf5ff',
          cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          '&:hover': { background: '#f3e8ff' },
        }}
      >
        {variant.previewUrl ? (
          <img
            src={variant.previewUrl}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Typography sx={{ fontSize: 22 }}>🖼️</Typography>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onImageChange(index, file);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />

      {/* Color name */}
      <TextField
        label="Color Name"
        value={variant.color_name}
        onChange={(e) => onNameChange(index, e.target.value)}
        size="small"
        placeholder="e.g. Dark Gray"
        sx={{ ...INPUT_SX, width: 160 }}
      />

      {/* Remove */}
      <Tooltip title="Remove">
        <IconButton
          onClick={() => onRemove(index)}
          sx={{ color: '#dc2626', '&:hover': { background: '#fee2e2' } }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}


// ── Full editor section ───────────────────────────────────────────────────────
interface ColorVariantsEditorProps {
  // For edit mode — existing variants from DB
  existingVariants?: ProductColorVariant[];
  onRemoveExisting?: (id: number) => void;

  // New variants being added
  newVariants: NewColorVariant[];
  onAdd: () => void;
  onNameChange: (index: number, name: string) => void;
  onImageChange: (index: number, file: File | null) => void;
  onRemoveNew: (index: number) => void;
}

export default function ColorVariantsEditor({
  existingVariants = [],
  onRemoveExisting,
  newVariants,
  onAdd,
  onNameChange,
  onImageChange,
  onRemoveNew,
}: ColorVariantsEditorProps) {
  const total = existingVariants.length + newVariants.length;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Color Variants
          {total > 0 && (
            <span style={{ marginLeft: 6, opacity: 0.6 }}>({total})</span>
          )}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddBoxOutlinedIcon />}
          onClick={onAdd}
          sx={{
            borderColor: '#7e22ce', color: '#7e22ce',
            '&:hover': { borderColor: '#6d28d9', background: '#faf5ff' },
          }}
        >
          Add Variant
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        {/* Existing variants */}
        {existingVariants.map((v) => (
          <ExistingVariantRow
            key={v.id}
            variant={v}
            onRemove={onRemoveExisting ?? (() => {})}
          />
        ))}

        {/* New variants */}
        {newVariants.map((v, i) => (
          <NewVariantRow
            key={i}
            variant={v}
            index={i}
            onNameChange={onNameChange}
            onImageChange={onImageChange}
            onRemove={onRemoveNew}
          />
        ))}

        {total === 0 && (
          <Typography variant="caption" color="text.disabled" sx={{ pl: 0.5 }}>
            No variants yet. Click "Add Variant" to add one.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

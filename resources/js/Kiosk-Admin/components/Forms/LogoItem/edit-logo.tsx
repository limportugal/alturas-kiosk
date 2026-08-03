import { useEffect, useState, useRef } from 'react';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Tooltip,
    Paper,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import { useUpdateLogo } from '@/Kiosk-Admin/hooks/logo/useUpdateLogo';
import { LogoList } from '@/Kiosk-Admin/types/logo-types';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

interface EditLogoProps {
    logo: LogoList;
}

export default function EditLogo({ logo }: EditLogoProps) {
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { form, imageFile, setImageFile, errors, setField, handleSubmit, isPending, isSuccess } =
        useUpdateLogo(logo);

    const initialImageUrl = logo.image_path.startsWith('/')
        ? logo.image_path
        : `/${logo.image_path}`;

    const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl);

    function strStartsWith(str: string, prefix: string) {
        return str.startsWith(prefix);
    }

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
        }
    }, [isSuccess]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            <Tooltip title="Edit Logo">
                <IconButton
                    onClick={() => setOpen(true)}
                    size="small"
                    sx={{
                        color: '#7e22ce',
                        border: '1px solid #e9d5ff',
                        borderRadius: 1.5,
                        p: '4px',
                        '&:hover': { backgroundColor: '#f3e8ff' },
                    }}
                >
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <BaseModal open={open} onClose={handleClose} title={`Edit Logo: ${logo.name}`} width={640}>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    {/* Required Specifications Information Box */}
                    <Paper
                        elevation={0}
                        sx={{
                            backgroundColor: '#faf5ff',
                            border: '1px solid #e9d5ff',
                            borderRadius: 2,
                            p: 2,
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <InfoOutlinedIcon sx={{ color: '#7e22ce', fontSize: 20 }} />
                            <Typography variant="subtitle2" sx={{ color: '#581c87', fontWeight: 700 }}>
                                Required Logo Specifications & Fit Guidelines
                            </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: '#6b21a8', display: 'block', lineHeight: 1.5 }}>
                            • <strong>Recommended Resolution:</strong> 512 × 512 pixels (Square 1:1 Aspect Ratio) — Min 200 × 200 px.<br />
                            • <strong>File Formats:</strong> PNG (Transparent background recommended), SVG, JPEG, WebP.<br />
                            • <strong>Max File Size:</strong> 2.0 MB.<br />
                            • <strong>Kiosk Rendering:</strong> Fixed max height 180px, max width 600px with <code>object-fit: contain</code>.
                        </Typography>
                    </Paper>

                    <TextField
                        label="Logo Name / Title"
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={INPUT_SX}
                        fullWidth
                    />

                    {/* Image Upload / Current Image Box */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#374151', fontWeight: 600 }}>
                            Logo Image (Click to change file)
                        </Typography>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            style={{ display: 'none' }}
                        />
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                border: '2px dashed #cbd5e1',
                                borderRadius: 2,
                                p: 2.5,
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#7e22ce',
                                    backgroundColor: '#f3e8ff',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <img
                                    src={previewUrl}
                                    alt="Logo Preview"
                                    style={{ maxHeight: 120, maxWidth: 300, objectFit: 'contain' }}
                                />
                                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                                    {imageFile ? `New file selected: ${imageFile.name}` : 'Click to replace current image file'}
                                </Typography>
                            </Box>
                        </Box>
                        {errors.image && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors.image}
                            </Typography>
                        )}
                    </Box>

                    <TextField
                        select
                        label="Status"
                        value={form.status}
                        onChange={(e) => setField('status', e.target.value as 'Active' | 'Inactive')}
                        error={!!errors.status}
                        helperText={errors.status}
                        sx={INPUT_SX}
                        fullWidth
                    >
                        <MenuItem value="Active">Active (Set as current Kiosk logo)</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSubmit}
                        disabled={isPending}
                        sx={BTN_SX}
                        fullWidth
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Stack>
            </BaseModal>
        </div>
    );
}

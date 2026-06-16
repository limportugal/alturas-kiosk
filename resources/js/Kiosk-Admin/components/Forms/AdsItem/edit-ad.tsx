import { useRef, useState } from 'react';
import { Button, Stack, TextField, MenuItem } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useUpdateAd } from '@/Kiosk-Admin/hooks/ads/useUpdateAd';
import { useAdsStore } from '@/Kiosk-Admin/hooks/zustands/use-store-ads';
import { AdsList } from '@/Kiosk-Admin/types/ads-types';

interface Props { ad: AdsList | null; }

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

export default function EditAd({ ad }: Props) {
    const [open, setOpen]       = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef          = useRef<HTMLInputElement>(null);
    const adsState              = useAdsStore();

    const { handleSubmit, handleFileChange, file, setFile, errors, isPending } =
        useUpdateAd(open ? ad : null);

    const handleClose = () => {
        setOpen(false);
        adsState.resetForm();
        setFile(null);
        setPreview(null);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        handleFileChange(files);
        const f = files?.[0];
        if (f && f.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(f));
        } else {
            setPreview(null);
        }
    };

    return (
        <>
            <Button variant="contained" size="small" sx={BTN_SX} startIcon={<EditOutlinedIcon />} onClick={() => setOpen(true)}>
                Edit
            </Button>

            <BaseModal open={open} onClose={handleClose} title="Edit Ad">
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField label="Title" value={adsState.title ?? ''} onChange={(e) => adsState.setTitle(e.target.value)}
                        error={!!errors.title} helperText={errors.title} sx={INPUT_SX} />

                    <TextField label="Sort Order" type="number" value={adsState.sort_order ?? 0}
                        onChange={(e) => adsState.setSortOrder(Number(e.target.value))}
                        error={!!errors.sort_order} helperText={errors.sort_order} sx={INPUT_SX}
                        slotProps={{ htmlInput: { min: 0 } }} />

                    <TextField label="Duration (seconds)" type="number" value={adsState.duration ?? 15}
                        onChange={(e) => adsState.setDuration(Number(e.target.value))}
                        error={!!errors.duration} helperText={errors.duration ?? 'How long this ad shows (3–120s)'}
                        sx={INPUT_SX} slotProps={{ htmlInput: { min: 3, max: 120 } }} />

                    <TextField select label="Status" value={adsState.status ?? 'Active'}
                        onChange={(e) => adsState.setStatus(e.target.value)}
                        error={!!errors.status} helperText={errors.status} sx={INPUT_SX}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    {/* Current file */}
                    {ad?.file_path && !file && (
                        <div style={{ fontSize: 12, color: '#555' }}>
                            Current: {ad.type === 'image'
                                ? <img src={`/${ad.file_path}`} alt={ad.title} style={{ display: 'block', marginTop: 4, width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid #e0dbd5' }} />
                                : <span>📹 {ad.file_path}</span>
                            }
                        </div>
                    )}

                    {/* Replace file */}
                    <div>
                        <Button variant="outlined" component="label" sx={{ borderColor: '#7e22ce', color: '#7e22ce' }}>
                            Replace File (optional)
                            <input ref={fileInputRef} type="file" hidden accept="image/*,video/mp4,video/webm" onChange={onFileChange} />
                        </Button>
                        {file && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>📎 {file.name}</div>}
                        {preview && <img src={preview} alt="preview" style={{ marginTop: 8, width: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 8, border: '1px solid #e0dbd5' }} />}
                    </div>

                    <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSubmit} disabled={isPending} sx={BTN_SX}>
                        {isPending ? 'Saving...' : 'Save Ad'}
                    </Button>
                </Stack>
            </BaseModal>
        </>
    );
}

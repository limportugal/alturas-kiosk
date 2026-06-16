import { useRef, useState } from 'react';
import { Button, Stack, TextField, MenuItem } from '@mui/material';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useCreateAd } from '@/Kiosk-Admin/hooks/ads/useCreateAd';
import { useAdsStore } from '@/Kiosk-Admin/hooks/zustands/use-store-ads';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

export default function AddAd() {
    const [open, setOpen]             = useState(false);
    const [preview, setPreview]       = useState<string | null>(null);
    const fileInputRef                = useRef<HTMLInputElement>(null);
    const { title, setTitle, sort_order, setSortOrder, duration, setDuration, status, setStatus, resetForm } = useAdsStore();
    const { handleSubmit, handleFileChange, file, setFile, errors, isPending } = useCreateAd();

    const handleClose = () => {
        setOpen(false);
        resetForm();
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
        <div>
            <Button variant="contained" sx={BTN_SX} startIcon={<AddBoxOutlinedIcon />} onClick={() => setOpen(true)}>
                Add Ad
            </Button>

            <BaseModal open={open} onClose={handleClose} title="Add New Ad">
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                        error={!!errors.title} helperText={errors.title} sx={INPUT_SX} />

                    <TextField label="Sort Order" type="number" value={sort_order}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                        error={!!errors.sort_order} helperText={errors.sort_order} sx={INPUT_SX}
                        slotProps={{ htmlInput: { min: 0 } }} />

                    <TextField label="Duration (seconds)" type="number" value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        error={!!errors.duration} helperText={errors.duration ?? 'How long this ad shows (3–120s)'}
                        sx={INPUT_SX} slotProps={{ htmlInput: { min: 3, max: 120 } }} />

                    <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}
                        error={!!errors.status} helperText={errors.status} sx={INPUT_SX}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    {/* File upload */}
                    <div>
                        <Button variant="outlined" component="label" sx={{ borderColor: errors.file_path ? 'red' : '#7e22ce', color: '#7e22ce' }}>
                            Upload Image / Video
                            <input ref={fileInputRef} type="file" hidden accept="image/*,video/mp4,video/webm" onChange={onFileChange} />
                        </Button>
                        {errors.file_path && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.file_path}</div>}
                        {file && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>📎 {file.name}</div>}
                        {preview && <img src={preview} alt="preview" style={{ marginTop: 8, width: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 8, border: '1px solid #e0dbd5' }} />}
                    </div>

                    <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSubmit} disabled={isPending} sx={BTN_SX}>
                        {isPending ? 'Adding...' : 'Add Ad'}
                    </Button>
                </Stack>
            </BaseModal>
        </div>
    );
}

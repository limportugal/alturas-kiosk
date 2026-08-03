import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { GetLogoService } from '@/Kiosk-Admin/services/logo/LogoServices';
import { useUpdateLogoMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/logoMutation/useUpdateLogoMutation';
import { useResetLogoMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/logoMutation/useResetLogoMutation';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

const INPUT_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

export default function LogoSettingsPage() {
    const { data, isPending } = useDynamicQuery(['app-logo'], GetLogoService);
    const updateMutation = useUpdateLogoMutation();
    const resetMutation = useResetLogoMutation();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const currentLogo = data?.logo ?? null;

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(currentLogo);
        }
    }, [selectedFile, currentLogo]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleSave = () => {
        if (!selectedFile) return;
        updateMutation.mutate(selectedFile, {
            onSuccess: () => {
                setSelectedFile(null);
            },
        });
    };

    const handleReset = () => {
        resetMutation.mutate(undefined, {
            onSuccess: () => {
                setSelectedFile(null);
                setPreviewUrl(null);
            },
        });
    };

    if (isPending) {
        return (
            <Box className="m-4">
                <AdminTableSkeleton />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#f0f0f5', mb: 1 }}>
                LOGICAL LOGO MAINTENANCE
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                Customize and manage your application's brand logo displayed across navigation drawers and headers.
            </Typography>

            <Grid container spacing={3}>
                {/* Required Specifications & Guidelines Card */}
                <Grid item xs={12} md={5}>
                    <Card
                        sx={{
                            backgroundColor: '#18181c',
                            color: '#f0f0f5',
                            border: '1px solid #2e2e38',
                            borderRadius: 3,
                            height: '100%',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <InfoOutlinedIcon sx={{ color: '#a855f7' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
                                    Logo Requirements & Fit Specs
                                </Typography>
                            </Stack>

                            <Divider sx={{ borderColor: '#2e2e38', mb: 2.5 }} />

                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                        RECOMMENDED DIMENSIONS
                                    </Typography>
                                    <Chip
                                        label="512 × 512 px (1:1 Aspect Ratio)"
                                        size="small"
                                        sx={{ backgroundColor: '#27272a', color: '#c084fc', fontWeight: 600, borderRadius: 1.5 }}
                                    />
                                    <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mt: 0.5 }}>
                                        Minimum resolution: 200 × 200 px. Square images ensure perfectly proportioned display.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                        SUPPORTED FILE FORMATS
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {['PNG (Recommended)', 'SVG', 'JPEG', 'WebP'].map((format) => (
                                            <Chip
                                                key={format}
                                                label={format}
                                                size="small"
                                                sx={{ backgroundColor: '#27272a', color: '#e4e4e7', fontSize: 11 }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                        MAXIMUM FILE SIZE
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#e4e4e7', fontWeight: 600 }}>
                                        2.0 MB
                                    </Typography>
                                </Box>

                                <Box sx={{ backgroundColor: '#27272a', p: 2, borderRadius: 2, border: '1px solid #3f3f46' }}>
                                    <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 700, display: 'block', mb: 0.5 }}>
                                        💡 DESIGN TIPS FOR BEST RESULTS
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#d4d4d8', display: 'block', lineHeight: 1.5 }}>
                                        • Use a <strong>transparent background (PNG or SVG)</strong> for seamless integration into dark navigation headers.<br />
                                        • Keep central emblem centered with minimal padding.<br />
                                        • Avoid tiny unreadable subtext inside the logo mark.
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Upload & Live UI Preview Card */}
                <Grid item xs={12} md={7}>
                    <Card
                        sx={{
                            backgroundColor: '#18181c',
                            color: '#f0f0f5',
                            border: '1px solid #2e2e38',
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
                                Upload & Live UI Preview
                            </Typography>
                            <Divider sx={{ borderColor: '#2e2e38', mb: 3 }} />

                            {/* Live UI Preview Box */}
                            <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1, fontWeight: 600 }}>
                                FIXED UI PREVIEW (HOW IT RENDERS IN THE APP)
                            </Typography>
                            <Paper
                                sx={{
                                    backgroundColor: '#111114',
                                    border: '1px solid #27272a',
                                    p: 2.5,
                                    borderRadius: 2,
                                    mb: 3,
                                }}
                            >
                                <Grid container spacing={2} alignItems="center">
                                    {/* Sidebar Preview (34x34px) */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mb: 1 }}>
                                            Navigation Sidebar (Fixed 34x34px Container):
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                p: 1.5,
                                                backgroundColor: '#18181c',
                                                borderRadius: 2,
                                                border: '1px solid #27272a',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 1.5,
                                                    backgroundColor: '#1a1a22',
                                                    border: '1px solid #2e2e3e',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="App Logo Preview"
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: 18 }}>📦</span>
                                                )}
                                            </Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f0f0f5' }}>
                                                ALTURAS KIOSK
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Large Header Preview (64x64px) */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mb: 1 }}>
                                            Kiosk Screen Header (Fixed 64x64px Container):
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 2,
                                                backgroundColor: '#18181c',
                                                borderRadius: 2,
                                                border: '1px solid #27272a',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 2,
                                                    backgroundColor: '#1a1a22',
                                                    border: '1px solid #2e2e3e',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    p: 0.5,
                                                }}
                                            >
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Large Logo Preview"
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: 32 }}>📦</span>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Drag and Drop / Picker Box */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                style={{ display: 'none' }}
                            />

                            <Box
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    border: '2px dashed #4b5563',
                                    borderRadius: 3,
                                    p: 4,
                                    textAlign: 'center',
                                    backgroundColor: '#111114',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#a855f7',
                                        backgroundColor: '#18181c',
                                    },
                                    mb: 3,
                                }}
                            >
                                <CloudUploadOutlinedIcon sx={{ fontSize: 44, color: '#a855f7', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e4e4e7' }}>
                                    {selectedFile ? selectedFile.name : 'Click or drag & drop new logo image here'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#71717a' }}>
                                    Supports PNG, SVG, JPEG, WebP (Max 2MB)
                                </Typography>
                            </Box>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                {currentLogo && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<RestartAltOutlinedIcon />}
                                        onClick={handleReset}
                                        disabled={resetMutation.isPending || updateMutation.isPending}
                                        sx={{ borderColor: '#ef4444', color: '#ef4444' }}
                                    >
                                        Reset to Default Logo
                                    </Button>
                                )}

                                {selectedFile && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<DeleteOutlinedIcon />}
                                        onClick={() => setSelectedFile(null)}
                                        sx={{ borderColor: '#6b7280', color: '#9ca3af' }}
                                    >
                                        Cancel File
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    startIcon={<SaveOutlinedIcon />}
                                    onClick={handleSave}
                                    disabled={!selectedFile || updateMutation.isPending}
                                    sx={INPUT_SX}
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save New Logo'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

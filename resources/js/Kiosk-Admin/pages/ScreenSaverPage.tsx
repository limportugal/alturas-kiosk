import { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { getKioskSettings, updateKioskSettings } from '@/Kiosk-Admin/services/settings/KioskSettingsServices';
import { useToast } from '@/hooks/use-toast';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': {
        color: '#f0f0f5',
        backgroundColor: '#14141c',
        '& fieldset': { borderColor: '#3a3a4a' },
        '&:hover fieldset': { borderColor: '#7e22ce' },
        '&.Mui-focused fieldset': { borderColor: '#7e22ce' },
        '&.Mui-disabled': {
            backgroundColor: '#181822',
        },
        '&.Mui-disabled fieldset': {
            borderColor: '#252536',
        },
        '&.Mui-disabled .MuiOutlinedInput-input': {
            WebkitTextFillColor: '#7a7a8c',
        },
    },
    '& .MuiInputLabel-root': { color: '#aaa' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
    '& .MuiInputLabel-root.Mui-disabled': { color: '#66667a' },
    '& .MuiFormHelperText-root': { color: '#888' },
    '& .MuiFormHelperText-root.Mui-disabled': { color: '#66667a' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
    '&.Mui-disabled': {
        backgroundColor: '#2a2a3a',
        color: '#8d8da3',
    },
};

const PRESET_TIMES = [
    { label: '30 sec', value: 30 },
    { label: '1 min', value: 60 },
    { label: '2 min', value: 120 },
    { label: '5 min', value: 300 },
];

export default function ScreenSaverPage() {
    const { showToast }               = useToast();
    const [enabled, setEnabled]       = useState<boolean>(true);
    const [seconds, setSeconds]       = useState<number | ''>(60);
    const [savedEnabled, setSavedEnabled] = useState<boolean>(true);
    const [savedSeconds, setSavedSeconds] = useState<number>(60);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [error, setError]           = useState<string | null>(null);

    useEffect(() => {
        getKioskSettings()
            .then((data) => {
                setEnabled(data.idle_enabled);
                setSeconds(data.idle_timeout_seconds);
                setSavedEnabled(data.idle_enabled);
                setSavedSeconds(data.idle_timeout_seconds);
            })
            .catch(() => showToast({ message: 'Failed to load settings', type: 'error' }))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!enabled) {
            setError(null);
        }
    }, [enabled]);

    const numericSeconds = typeof seconds === 'number' ? seconds : 0;
    const hasChanges = enabled !== savedEnabled || Number(seconds || 0) !== savedSeconds;
    const hasValidSeconds = !enabled || (typeof seconds === 'number' && seconds >= 10 && seconds <= 3600);
    const disableSave = saving || !enabled || !hasChanges || !hasValidSeconds;

    const handleToggleEnabled = async (checked: boolean) => {
        setEnabled(checked);

        if (checked) {
            return;
        }

        setError(null);
        setSaving(true);
        try {
            await updateKioskSettings({
                idle_enabled: false,
                idle_timeout_seconds: savedSeconds,
            });
            setSavedEnabled(false);
            showToast({ message: 'Idle reset disabled', type: 'success' });
        } catch {
            setEnabled(true);
            showToast({ message: 'Failed to update setting', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (enabled && (numericSeconds < 10 || numericSeconds > 3600)) {
            setError('Must be between 10 and 3600 seconds');
            return;
        }
        setError(null);
        setSaving(true);
        try {
            await updateKioskSettings({
                idle_enabled: enabled,
                idle_timeout_seconds: numericSeconds,
            });
            setSavedEnabled(enabled);
            setSavedSeconds(numericSeconds);
            showToast({ message: 'Settings saved', type: 'success' });
        } catch {
            showToast({ message: 'Failed to save settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 style={{ color: '#f0f0f5', marginBottom: 8 }}>Timer</h2>
            <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
                Set how long the kiosk waits before returning to the screen saver.
            </p>

            {loading ? (
                <CircularProgress size={28} sx={{ color: '#7e22ce' }} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enabled}
                                onChange={(e) => void handleToggleEnabled(e.target.checked)}
                                disabled={saving}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#7e22ce' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7e22ce',
                                    },
                                }}
                            />
                        }
                        label="Enable idle reset / screen saver"
                        sx={{
                            margin: 0,
                            '& .MuiFormControlLabel-label': { color: '#f0f0f5' },
                        }}
                    />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {PRESET_TIMES.map((preset) => {
                            const active = enabled && seconds === preset.value;

                            return (
                                <Button
                                    key={preset.value}
                                    type="button"
                                    variant={active ? 'contained' : 'outlined'}
                                    disabled={!enabled}
                                    onClick={() => {
                                        setSeconds(preset.value);
                                        setError(null);
                                    }}
                                    sx={{
                                        minWidth: 0,
                                        padding: '8px 14px',
                                        borderColor: active ? '#7e22ce' : '#3a3a4a',
                                        color: active ? '#fff' : '#d8d8e3',
                                        backgroundColor: active ? '#7e22ce' : 'transparent',
                                        '&:hover': {
                                            borderColor: '#7e22ce',
                                            backgroundColor: active ? '#6d28d9' : 'rgba(126, 34, 206, 0.08)',
                                        },
                                        '&.Mui-disabled': {
                                            borderColor: '#252536',
                                            color: '#6d6d80',
                                            backgroundColor: '#181822',
                                        },
                                    }}
                                >
                                    {preset.label}
                                </Button>
                            );
                        })}
                    </div>

                    <TextField
                        label="Idle Timeout (seconds)"
                        type="number"
                        value={enabled ? seconds : ''}
                        onChange={(e) => setSeconds(e.target.value === '' ? '' : Number(e.target.value))}
                        disabled={!enabled}
                        slotProps={{ htmlInput: { min: 10, max: 3600 } }}
                        error={enabled && !!error}
                        helperText={
                            !enabled
                                ? 'Idle reset is currently disabled.'
                                : error ?? `Currently set to ${numericSeconds}s (${(numericSeconds / 60).toFixed(1)} min)`
                        }
                        sx={INPUT_SX}
                    />

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSave}
                        disabled={disableSave}
                        sx={BTN_SX}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            )}
        </div>
    );
}

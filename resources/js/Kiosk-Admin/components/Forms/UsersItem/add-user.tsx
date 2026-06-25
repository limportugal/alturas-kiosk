import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import { useCreateUser } from '@/Kiosk-Admin/hooks/users/useCreateUser';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

interface AddUserProps {
    permissions: string[];
}

export default function AddUser({ permissions }: AddUserProps) {
    const [open, setOpen] = useState(false);
    const { form, errors, setField, togglePermission, handleSubmit, isPending, isSuccess } = useCreateUser();

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
        }
    }, [isSuccess]);

    return (
        <div>
            <Button
                variant="contained"
                sx={BTN_SX}
                startIcon={<AddBoxOutlinedIcon />}
                onClick={() => setOpen(true)}
            >
                Add User
            </Button>

            <BaseModal open={open} onClose={handleClose} title="Add New User" width={640}>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={INPUT_SX}
                    />

                    <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={INPUT_SX}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setField('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={INPUT_SX}
                    />

                    <TextField
                        select
                        label="Role"
                        value={form.role}
                        onChange={(e) => setField('role', e.target.value as 'admin' | 'staff')}
                        error={!!errors.role}
                        helperText={errors.role}
                        sx={INPUT_SX}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Status"
                        value={form.status}
                        onChange={(e) => setField('status', e.target.value as 'Active' | 'Inactive')}
                        error={!!errors.status}
                        helperText={errors.status}
                        sx={INPUT_SX}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    {form.role === 'staff' ? (
                        <Box
                            sx={{
                                border: '1px solid #d1d5db',
                                borderRadius: 2,
                                px: 2,
                                py: 1.5,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#374151' }}>
                                Staff Permissions
                            </Typography>
                            <FormGroup>
                                {permissions.map((permission) => (
                                    <FormControlLabel
                                        key={permission}
                                        control={
                                            <Checkbox
                                                checked={(form.permissions ?? []).includes(permission)}
                                                onChange={() => togglePermission(permission)}
                                            />
                                        }
                                        label={permission}
                                    />
                                ))}
                            </FormGroup>
                            {errors.permissions && (
                                <Typography variant="caption" color="error">
                                    {errors.permissions}
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Admin users automatically receive full access.
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSubmit}
                        disabled={isPending}
                        sx={BTN_SX}
                    >
                        {isPending ? 'Adding...' : 'Add User'}
                    </Button>
                </Stack>
            </BaseModal>
        </div>
    );
}

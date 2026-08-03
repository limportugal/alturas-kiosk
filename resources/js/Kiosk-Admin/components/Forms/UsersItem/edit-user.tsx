import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Tooltip,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BaseModal from '@/Kiosk-Admin/components/modals/BaseModal';
import { useUpdateUser } from '@/Kiosk-Admin/hooks/users/useUpdateUser';
import { UserListItem } from '@/Kiosk-Admin/types/user-types';

const INPUT_SX = {
    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#7e22ce' } },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7e22ce' },
};

const BTN_SX = {
    backgroundColor: '#7e22ce',
    '&:hover': { backgroundColor: '#6d28d9' },
};

interface EditUserProps {
    user: UserListItem;
    permissions?: string[];
}

export default function EditUser({ user, permissions = [] }: EditUserProps) {
    const [open, setOpen] = useState(false);
    const { form, errors, setField, togglePermission, handleSubmit, isPending, isSuccess } =
        useUpdateUser(user);

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
            <Tooltip title="Edit User">
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

            <BaseModal open={open} onClose={handleClose} title={`Edit User: ${user.name}`} width={640}>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Full Name"
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
                        label="New Password (leave blank to keep current)"
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
                        onChange={(e) =>
                            setField('role', e.target.value as 'super-admin' | 'admin' | 'staff')
                        }
                        error={!!errors.role}
                        helperText={errors.role}
                        sx={INPUT_SX}
                    >
                        <MenuItem value="super-admin">Super Admin</MenuItem>
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
                            {form.role === 'super-admin'
                                ? 'Super Admin users automatically receive full access to all system features.'
                                : 'Admin users automatically receive full access.'}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSubmit}
                        disabled={isPending}
                        sx={BTN_SX}
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Stack>
            </BaseModal>
        </div>
    );
}

import { usePage } from '@inertiajs/react';

type PermissionInput = string | string[];

export const useAuthorization = () => {
    const { props } = usePage<SharedPageProps>();
    const role = props.auth?.user?.role ?? null;
    const permissions = props.auth?.user?.permission ?? [];

    const isSuperAdmin = role === 'super-admin';
    const isAdmin = role === 'admin' || isSuperAdmin;

    const hasRole = (expectedRole: string) => role === expectedRole;

    const hasPermission = (permission: string) =>
        isSuperAdmin || isAdmin || permissions.includes(permission);

    const canAccess = (options?: {
        permission?: PermissionInput;
        adminOnly?: boolean;
        superAdminOnly?: boolean;
        requireAll?: boolean;
    }) => {
        if (!options) return true;

        if (isSuperAdmin) return true;

        if (options.superAdminOnly) {
            return isSuperAdmin;
        }

        if (options.adminOnly) {
            return isAdmin;
        }

        if (!options.permission) {
            return true;
        }

        const targetPermissions = Array.isArray(options.permission)
            ? options.permission
            : [options.permission];

        if (targetPermissions.length === 0) {
            return true;
        }

        if (isAdmin) {
            return true;
        }

        if (options.requireAll) {
            return targetPermissions.every((item) => permissions.includes(item));
        }

        return targetPermissions.some((item) => permissions.includes(item));
    };

    return {
        role,
        permissions,
        hasRole,
        hasPermission,
        canAccess,
        isSuperAdmin,
        isAdmin,
    };
};

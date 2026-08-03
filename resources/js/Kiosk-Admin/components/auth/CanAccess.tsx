import { ReactNode } from 'react';
import { useAuthorization } from '@/Kiosk-Admin/hooks/auth/useAuthorization';

interface CanAccessProps {
    children: ReactNode;
    fallback?: ReactNode;
    permission?: string | string[];
    adminOnly?: boolean;
    superAdminOnly?: boolean;
    requireAll?: boolean;
}

export default function CanAccess({
    children,
    fallback = null,
    permission,
    adminOnly = false,
    superAdminOnly = false,
    requireAll = false,
}: CanAccessProps) {
    const { canAccess } = useAuthorization(); 

    if (!canAccess({ permission, adminOnly, superAdminOnly, requireAll })) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

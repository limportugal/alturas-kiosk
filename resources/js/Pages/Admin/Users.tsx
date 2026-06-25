import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import UsersPage from '@/Kiosk-Admin/pages/UsersPage';

interface Props {
    auth?: {
        user?: {
            name: string;
            role?: string;
        };
    };
    permissions: string[];
}

export default function Users({ auth, permissions }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <UsersPage permissions={permissions ?? []} />
            </div>
        </SideNavDrawer>
    );
}

import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import LogoSettingsPage from '@/Kiosk-Admin/pages/LogoSettingsPage';

interface Props {
    auth?: { user?: { name: string; role?: string } };
}

export default function LogoSettings({ auth }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <LogoSettingsPage />
            </div>
        </SideNavDrawer>
    );
}

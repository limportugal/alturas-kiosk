import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import ScreenSaverPage from '@/Kiosk-Admin/pages/ScreenSaverPage';

interface Props {
    auth?: { user?: { name: string; role?: string } };
}

export default function ScreenSaver({ auth }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <ScreenSaverPage />
            </div>
        </SideNavDrawer>
    );
}

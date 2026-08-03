import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import LogoPage from '@/Kiosk-Admin/pages/LogoPage';

interface Props {
    auth?: { user?: { name: string; role?: string } };
}

export default function Logos({ auth }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <LogoPage />
            </div>
        </SideNavDrawer>
    );
}

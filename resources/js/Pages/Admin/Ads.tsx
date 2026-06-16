import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import AdsPage from '@/Kiosk-Admin/pages/AdsPage';

interface Props {
    auth?: { user?: { name: string; role?: string } };
}

export default function Ads({ auth }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <AdsPage />
            </div>
        </SideNavDrawer>
    );
}

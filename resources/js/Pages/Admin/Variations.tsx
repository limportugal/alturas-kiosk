import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import VariationsPage from '@/Kiosk-Admin/pages/VariationsPage';

interface Props {
    auth?: {
        user?: {
            name: string;
            role?: string;
        };
    };
}

export default function Variations({ auth }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <VariationsPage />
            </div>
        </SideNavDrawer>
    );
}

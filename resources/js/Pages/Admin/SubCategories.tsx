import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import SubCategoriesPage from '@/Kiosk-Admin/pages/SubCategoriesPage';

interface Props {
    auth?: {
        user?: {
            name: string;
            role?: string;
        };
    };
}

export default function SubCategories({ auth }: Props) {
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <SubCategoriesPage />
            </div>
        </SideNavDrawer>
    );
}

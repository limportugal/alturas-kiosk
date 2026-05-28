import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import CatergoriesPage from '@/Kiosk-Admin/pages/CategoriesPage';

interface Props {
  auth?: {
    user?: {
      name: string;
      role?: string;
    };
  };
}
 
export default function Categories({ auth }: Props) {
  return (
    <SideNavDrawer auth={auth}>
      <div style={{ padding: 32 }}>
        <CatergoriesPage />
      </div>
    </SideNavDrawer>
  );
}
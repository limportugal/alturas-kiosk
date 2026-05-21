import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import ProductItemPage from '@/Kiosk-Admin/pages/ProductItemPage';

interface Props {
  auth?: {
    user?: {
      name: string;
      role?: string;
    };
  };
}
 
export default function ProductItem({ auth }: Props) {
  return (
    <SideNavDrawer auth={auth}>
      <div style={{ padding: 32 }}>
        <ProductItemPage />
      </div>
    </SideNavDrawer>
  );
}
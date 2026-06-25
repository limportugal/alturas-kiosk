import SideNavDrawer from '@/Kiosk-Admin/components/nav';
import UserLogsPage from '@/Kiosk-Admin/pages/UserLogsPage';

interface Props {
  auth?: {
    user?: {
      name: string;
      role?: string;
    };
  };
}

export default function UserLogs({ auth }: Props){
    return (
        <SideNavDrawer auth={auth}>
            <div style={{ padding: 32 }}>
                <UserLogsPage />
            </div>
        </SideNavDrawer>
    );
}
import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { userColumns } from '@/Kiosk-Admin/components/Datatable/column';
import AddUser from '@/Kiosk-Admin/components/Forms/UsersItem/add-user';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';
import CanAccess from '@/Kiosk-Admin/components/auth/CanAccess';
import { GetUsersListServices } from '@/Kiosk-Admin/services/users/GetUsersListServices';

interface UsersPageProps {
    permissions: string[];
}

export default function UsersPage({ permissions }: UsersPageProps) {
    const { data: usersData, isPending } = useDynamicQuery(['user-list'], GetUsersListServices);

    if (isPending) {
        return (
            <div className="m-4">
                <AdminTableSkeleton />
            </div>
        );
    }

    return (
        <div className="m-4">
            <DataTable
                title="USERS"
                rows={usersData?.data ?? []}
                columns={userColumns}
                actions={(
                    <CanAccess adminOnly>
                        <AddUser permissions={permissions} />
                    </CanAccess>
                )}
                searchable={true}
            />
        </div>
    );
}

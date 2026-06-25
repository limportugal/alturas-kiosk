import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { userColumns } from '@/Kiosk-Admin/components/Datatable/column';
import AddUser from '@/Kiosk-Admin/components/Forms/UsersItem/add-user';
import { GetUsersListServices } from '@/Kiosk-Admin/services/users/GetUsersListServices';

interface UsersPageProps {
    permissions: string[];
}

export default function UsersPage({ permissions }: UsersPageProps) {
    const { data: usersData } = useDynamicQuery(['user-list'], GetUsersListServices);

    return (
        <div className="m-4">
            <DataTable
                title="Users"
                rows={usersData?.data ?? []}
                columns={userColumns}
                actions={<AddUser permissions={permissions} />}
                searchable={true}
            />
        </div>
    );
}

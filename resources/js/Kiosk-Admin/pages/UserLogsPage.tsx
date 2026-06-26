import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { UsersLogs } from '@/Kiosk-Admin/components/Datatable/column'
import { GetActivityLogServices } from '@/Kiosk-Admin/services/activityLogs/GetActivityLogsServices';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

export default function UserLogsPage() {
    const {
        data: user_logs_data,
        isPending: isPending_UserLogs
    } = useDynamicQuery(['user_logs'],GetActivityLogServices);

          if (isPending_UserLogs) {
                return (
                    <div className="m-4">
                        <AdminTableSkeleton />
                    </div>
                );
            }

    
    return (
        <div className="m-4">
            <DataTable 
                title='USER LOGS '
                columns={UsersLogs} 
                rows={user_logs_data?.data ?? []} 
                searchable={true}
                defaultOrder="desc"
                />
        </div>
    );
}
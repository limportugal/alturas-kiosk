import useDynamicQuery from '@/hooks/useDynamicQuery';
import * as React from 'react';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { GetLogosListServices } from '@/Kiosk-Admin/services/logo/GetLogosListServices';
import { LogoItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddLogo from '@/Kiosk-Admin/components/Forms/LogoItem/add-logo';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';
import CanAccess from '@/Kiosk-Admin/components/auth/CanAccess';

export default function LogoPage() {
    const { data: logo_data, isPending } = useDynamicQuery(['logo-list'], GetLogosListServices);

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
                title="LOGO MANAGEMENT"
                rows={logo_data?.data ?? []}
                columns={LogoItem}
                actions={(
                    <CanAccess superAdminOnly>
                        <AddLogo />
                    </CanAccess>
                )}
                searchable={true}
            />
        </div>
    );
}

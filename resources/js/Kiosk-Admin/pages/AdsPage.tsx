import useDynamicQuery from '@/hooks/useDynamicQuery';
import * as React from 'react';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { GetAdListServices } from '@/Kiosk-Admin/services/ads/GetAdListServices';
import { AdsItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddAd from '@/Kiosk-Admin/components/Forms/AdsItem/add-ad';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

import {AdsList} from '@/Kiosk-Admin/types/ads-types';
import { useAdsRowOrdering } from '@/Kiosk-Admin/hooks/ads/userReOrderAd'

export default function AdsPage() {
    const [AdRows, setAdRows] = React.useState<AdsList[]>([]);
    const { handleRowReOrderSave } = useAdsRowOrdering();
    const { data: ads_data, isPending } = useDynamicQuery(['ads-list'], GetAdListServices);

     React.useEffect(() => {
        setAdRows(ads_data ??[]);
        }, [ads_data]);

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
                title="ADS MANAGEMENT"
                rows={AdRows}
                columns={AdsItem}
                actions={<AddAd />}
                searchable={true}
                defaultOrderBy="sort_order"
                defaultOrder="asc"
                    enableRowReordering
                onRowsReorder={(reorderedRows) => {
                    setAdRows(reorderedRows);
                    handleRowReOrderSave(reorderedRows);
                }}
            />
        </div>
    );
}

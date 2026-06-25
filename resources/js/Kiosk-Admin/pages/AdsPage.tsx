import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { GetAdListServices } from '@/Kiosk-Admin/services/ads/GetAdListServices';
import { AdsItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddAd from '@/Kiosk-Admin/components/Forms/AdsItem/add-ad';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

export default function AdsPage() {
    const { data: ads_data, isPending } = useDynamicQuery(['ads-list'], GetAdListServices);

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
                rows={ads_data?.data ?? []}
                columns={AdsItem}
                actions={<AddAd />}
                searchable={true}
                defaultOrderBy="sort_order"
                defaultOrder="asc"
            />
        </div>
    );
}

import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { GetAdListServices } from '@/Kiosk-Admin/services/ads/GetAdListServices';
import { AdsItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddAd from '@/Kiosk-Admin/components/Forms/AdsItem/add-ad';

export default function AdsPage() {
    const { data: ads_data } = useDynamicQuery(['ads-list'], GetAdListServices);

    return (
        <div className="m-4">
            <DataTable
                title="Ads Management"
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

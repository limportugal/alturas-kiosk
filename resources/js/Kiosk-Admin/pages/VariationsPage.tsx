import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { VariationListServices } from '@/Kiosk-Admin/services/variation/GetVariationListServices';
import { VariationItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddVariation from '@/Kiosk-Admin/components/Forms/VariationItem/add-variation';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

export default function VariationsPage() {
    const {
        data: variations_data,
        isPending: isPending_variations,
        isError: isError_variations,
    } = useDynamicQuery(
        ['variation-list'],
        VariationListServices
    );

        if (isPending_variations) {
            return (
                <div className="m-4">
                    <AdminTableSkeleton />
                </div>
            );
        }

    return (
        <div className="m-4">
            <DataTable
                title="VARIATIONS"
                rows={variations_data?.data ?? []}
                columns={VariationItem}
                groupBy={(row) => row.sub_category?.name ?? 'No Sub Category'}
                actions={<AddVariation />}
                searchable={true}
            />
        </div>
    );
}

import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { VariationListServices } from '@/Kiosk-Admin/services/variation/GetVariationListServices';
import { VariationItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddVariation from '@/Kiosk-Admin/components/Forms/VariationItem/add-variation';

export default function VariationsPage() {
    const {
        data: variations_data,
        isPending: isPending_variations,
        isError: isError_variations,
    } = useDynamicQuery(
        ['variation-list'],
        VariationListServices
    );

    return (
        <div className="m-4">
            <DataTable
                title="Variations"
                rows={variations_data?.data ?? []}
                columns={VariationItem}
                actions={<AddVariation />}
                searchable={true}
            />
        </div>
    );
}

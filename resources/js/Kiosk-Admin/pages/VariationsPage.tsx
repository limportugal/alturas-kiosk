import * as React from 'react';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { VariationListServices } from '@/Kiosk-Admin/services/variation/GetVariationListServices';
import { VariationItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddVariation from '@/Kiosk-Admin/components/Forms/VariationItem/add-variation';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

import {VariationList} from '@/Kiosk-Admin/types/variation-types';
import { useVariationRowOrdering } from '@/Kiosk-Admin/hooks/variation/useReorderVariations';

export default function VariationsPage() {
    const [variationRows, setVariationRows] = React.useState<VariationList[]>([]);
    const { handleRowReOrderSave, isPending} = useVariationRowOrdering();
    const {
        data: variations_data,
        isPending: isPending_variations,
        isError: isError_variations,
    } = useDynamicQuery(
        ['variation-list'],
        VariationListServices
    );

    React.useEffect(() => {
        setVariationRows(variations_data ?? []);
    }, [variations_data]);

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
                rows={variationRows}
                columns={VariationItem}
                groupBy={(row) => row.sub_category?.name ?? 'No Sub Category'}
                actions={<AddVariation />}
                searchable={true}
                enableRowReordering
                onRowsReorder={(reorderedRows) => {
              setVariationRows(reorderedRows);
              handleRowReOrderSave(reorderedRows);
        }}
            />
        </div>
    );
}

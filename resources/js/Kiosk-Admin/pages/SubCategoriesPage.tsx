import * as React from 'react';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { SubCategoriesServices } from '@/Kiosk-Admin/services/subcategory/GetSubCategoryListServices';
import { SubCatItem, renderProductExpandedRow  } from '@/Kiosk-Admin/components/Datatable/column';
import AddSubCategory from '@/Kiosk-Admin/components/Forms/SubCategoryItem/add-subcategory';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';
import { useSubCategoryRowOrdering } from '@/Kiosk-Admin/hooks/subcategory/useReorderSubCategory';
 
export default function SubCategoriesPage() {

    const [subcategoryRows, setSubCategoryRows] = React.useState<SubCategoryList[]>([]);
    const { handleRowReOrderSave, isPending} = useSubCategoryRowOrdering();
    const {
        data: subcategories_data,
        isPending: isPending_subcategories,
        isError: isError_subcategories,
    } = useDynamicQuery(
        ['sub-category-list'],
        SubCategoriesServices
    );

    React.useEffect(() => {
        setSubCategoryRows(subcategories_data?.data ?? []);
    },[subcategories_data]);

        if (isPending_subcategories) {
            return (
                <div className="m-4">
                    <AdminTableSkeleton />
                </div>
            );
        }

        // if (isPending) {
        //     return (
        //         <div className="m-4">
        //             <AdminTableSkeleton />
        //         </div>
        //     );
        // }

    return (
        <div className="m-4">
            <DataTable
                title="SUB-CATEGORIES"
                rows={subcategoryRows}
                columns={SubCatItem}
                groupBy={(row) => row.category?.name ?? 'No Category'}
                actions={<AddSubCategory />}
                searchable ={true}
                enableRowReordering
                onRowsReorder={(reorderRows) =>{
                    setSubCategoryRows(reorderRows);
                    handleRowReOrderSave(reorderRows);
                }}
            />
        </div>
    );
}

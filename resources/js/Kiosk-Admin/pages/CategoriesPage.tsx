import * as React from 'react';
import  useDynamicQuery  from "@/hooks/useDynamicQuery";
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { CategoriesServices } from '@/Kiosk-Admin/services/category/GetCategoriesListServices';
import { CatItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddCategory from "../components/Forms/CatergoryItem/add-category";
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

import { CategoryList } from "@/Kiosk-Admin/types/category-types";
import { useCategoryRowOrdering } from "@/Kiosk-Admin/hooks/category/useReorderCategory";


export default function CategoriesPage() {

    const [categoryRows, setCategoryRows] = React.useState<CategoryList[]>([]);
    const { handleRowReOrderSave, isPending} = useCategoryRowOrdering();
    const {
        data:categories_data,
        isPending:isPending_categories_data,
        isError: isError_categories_data,
    } = useDynamicQuery(
        ['category-list'],
        CategoriesServices
    )

    React.useEffect(() => {
    setCategoryRows(categories_data?.data ?? []);
    }, [categories_data]);

       if (isPending_categories_data) {
            return (
                <div className="m-4">
                    <AdminTableSkeleton />
                </div>
            );
        }
    


    return(
        
        <div className="m-4">
            <DataTable 
                title='CATEGORIES'
                rows={categoryRows}
                columns={CatItem}
                actions={<AddCategory/>}
                searchable ={true}
                enableRowReordering
                onRowsReorder={(reorderedRows) => {
                    setCategoryRows(reorderedRows);
                    handleRowReOrderSave(reorderedRows);
                }}
                // isPending={isPending_categories_data}
                // isError={isError_categories_data}
                // addItemLink='/kiosk-admin/categories/add'
            
            />
        </div>

    )
}

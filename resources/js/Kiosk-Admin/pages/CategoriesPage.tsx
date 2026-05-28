import  useDynamicQuery  from "@/hooks/useDynamicQuery";
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { CategoriesServices } from '@/Kiosk-Admin/services/category/GetCategoriesListServices';
import { CatItem } from '@/Kiosk-Admin/components/Datatable/column';

export default function CategoriesPage() {

    const {
        data:categories_data,
        isPending:isPending_categories_data,
        isError: isError_categories_data,
    } = useDynamicQuery(
        ['category-list'],
        CategoriesServices
    )

    return(
        
        <div className="m-4">
            <DataTable 
                title='Categories'
                rows={categories_data?.data ?? []}
                columns={CatItem}
                // isPending={isPending_categories_data}
                // isError={isError_categories_data}
                // addItemLink='/kiosk-admin/categories/add'
            
            />
        </div>

    )
}

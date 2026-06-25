import  useDynamicQuery  from "@/hooks/useDynamicQuery";
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { CategoriesServices } from '@/Kiosk-Admin/services/category/GetCategoriesListServices';
import { CatItem } from '@/Kiosk-Admin/components/Datatable/column';
import AddCategory from "../components/Forms/CatergoryItem/add-category";
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';


export default function CategoriesPage() {

    const {
        data:categories_data,
        isPending:isPending_categories_data,
        isError: isError_categories_data,
    } = useDynamicQuery(
        ['category-list'],
        CategoriesServices
    )

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
                rows={categories_data?.data ?? []}
                columns={CatItem}
                actions={<AddCategory/>}
                searchable ={true}
                // isPending={isPending_categories_data}
                // isError={isError_categories_data}
                // addItemLink='/kiosk-admin/categories/add'
            
            />
        </div>

    )
}

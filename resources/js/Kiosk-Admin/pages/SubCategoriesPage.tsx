import useDynamicQuery from '@/hooks/useDynamicQuery';
import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { SubCategoriesServices } from '@/Kiosk-Admin/services/subcategory/GetSubCategoryListServices';
import { SubCatItem, renderProductExpandedRow  } from '@/Kiosk-Admin/components/Datatable/column';
import AddSubCategory from '@/Kiosk-Admin/components/Forms/SubCategoryItem/add-subcategory';
import AdminTableSkeleton from '@/Kiosk-Admin/components/Skeletons/AdminTableSkeleton';

export default function SubCategoriesPage() {
    const {
        data: subcategories_data,
        isPending: isPending_subcategories,
        isError: isError_subcategories,
    } = useDynamicQuery(
        ['sub-category-list'],
        SubCategoriesServices
    );

        if (isPending_subcategories) {
            return (
                <div className="m-4">
                    <AdminTableSkeleton />
                </div>
            );
        }

    return (
        <div className="m-4">
            <DataTable
                title="SUB-CATEGORIES"
                rows={subcategories_data?.data ?? []}
                columns={SubCatItem}
                groupBy={(row) => row.category?.name ?? 'No Category'}
                actions={<AddSubCategory />}
                searchable ={true}
            />
        </div>
    );
}

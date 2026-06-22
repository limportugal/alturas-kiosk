
import  useDynamicQuery  from "@/hooks/useDynamicQuery";

import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { Proditem, renderProductExpandedRow } from '@/Kiosk-Admin/components/Datatable/column';
import AddProduct from '@/Kiosk-Admin/components/Forms/Product-Item/add-product';
import { ProductsServices } from '@/Kiosk-Admin/services/products/GetProductServices'

export default function ProductItemPage() {
  
  const {
        data:product_data,
        isPending: isPending_product_data,
        isError: isError_product_data, 
    } = useDynamicQuery(
        ['product-list'],
        ProductsServices  
    )

 
  return (
    
<div className="m-0">
       {/* <div className="mb-4 flex justify-end">
    <AddProduct />
      </div> */}
      <DataTable 
        title={'Products'}
        rows={product_data?.data ?? []}
        // loading= {isPending_product_data}
        columns={Proditem}
        renderExpandedRow={renderProductExpandedRow}
        groupBy={(row) => row.sub_category_name ?? 'No Sub Category'}
        searchable ={true}
        actions={<AddProduct />}
      />
     
  </div>
   
  );
}

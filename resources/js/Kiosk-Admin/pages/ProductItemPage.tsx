import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { itemCat } from '@/Kiosk-Admin/components/Datatable/column'
import AddProduct from '@/Kiosk-Admin/components/Forms/Product-Item/add-product'


const users = [
  {
    id: 12,
    name: 'John',
    sku: 1234,
    categoryId: 10,
    price: 25,
    description: 'this is demo description',
  },
];

export default function ProductItemPage() {
  return (
    <div className="m-0">
       <div className="mb-4 flex justify-end">
    <AddProduct />
  </div>
      <DataTable 
        title={'Item Category'}
        rows={users}
        columns={itemCat}
      />
     
    </div>
   
  );
}
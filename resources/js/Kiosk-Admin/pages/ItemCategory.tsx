import DataTable from '@/Kiosk-Admin/components/Datatable/DataTable';
import { itemCat } from '@/Kiosk-Admin/components/Datatable/column'


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

export default function ItemCategory() {
  return (
    <div className="m-0">
      <DataTable 
        title={'Item Category'}
        rows={users}
        columns={itemCat}
      />
    </div>
  );
}
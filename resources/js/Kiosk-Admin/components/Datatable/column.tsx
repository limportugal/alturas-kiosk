import { Column } from './types';
import { ProductItem } from '@/Kiosk-Admin/types/product-type';
import ProductToggleStatus from '@/Kiosk-Admin/components/ProductToggleStatus';
import EditProduct from '@/Kiosk-Admin/components/Forms/Product-Item/edit-product';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export const userColumns: Column<User>[] = [
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'age',
    label: 'Age',
    numeric: true,
  },
];

export const Proditem: Column<ProductItem>[] = [
  { id: 'category_name',    label: 'Category'    },
  { id: 'item_code',        label: 'Item Code'   },
  { id: 'name',             label: 'Item Name'   },
  { id: 'item_description', label: 'Description' },
  { id: 'sku',              label: 'SKU'         },
  { id: 'price',            label: 'Item Price'  },
  { id: 'quantity',         label: 'Quantity'    },
  {
    id: 'action',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Status toggle */}
        <ProductToggleStatus
          id={row.id}
          status={row.status === 'Active'}
        />
 
        {/* Edit button — ipapasa ang buong row as product */}
        <EditProduct product={row} />
      </div>
    ),
  },
];

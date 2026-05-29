import { Column } from './types';
import { ProductItem } from '@/Kiosk-Admin/types/product-type';
import { CategoryList } from '@/Kiosk-Admin/types/category-types';

import CategoryToggleStatus from '@/Kiosk-Admin/components/CategoryToggleStatus';
import ProductToggleStatus from '@/Kiosk-Admin/components/ProductToggleStatus';
import EditProduct from '@/Kiosk-Admin/components/Forms/Product-Item/edit-product';
import EditCategory from '@/Kiosk-Admin/components/Forms/CatergoryItem/edit-category';

import ImagePreviewCell from '@/Kiosk-Admin/components/Buttons/ImagePreviewCell';
import MultiplePreviewImage from '@/Kiosk-Admin/components/Buttons/MultiplePreviewImage';

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
  {
  id: 'images',
  label: 'Images',
  render: (row) => (
    <MultiplePreviewImage
      images={row.images}
      productName={row.name}
    />
  ),
},
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

export const CatItem: Column<CategoryList>[] = [
  {
    id:'image_path',
    label: "Image",
    render: (row) => (
      <ImagePreviewCell 
          imagePath={row.image_path}
          alt={row.name}
          />
    ),
  },
  {id: 'name', label: 'Category Name'},
  
  {id: 'actions', label: 'Actions',
  render: (row) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Status toggle */}
      <CategoryToggleStatus
        id={row.id}
        status={row.status === 'Active'}
      />
      <EditCategory category={row} />
    </div>
  ),
}
  // {id: 'image_path', label: 'image'}
  // {id: 'action', label: 'Action'},
];

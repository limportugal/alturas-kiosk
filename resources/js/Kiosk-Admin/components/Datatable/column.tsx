import { Column } from './types';
import { ProductItem } from '@/Kiosk-Admin/types/product-type';
import { CategoryList } from '@/Kiosk-Admin/types/category-types';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';

import CategoryToggleStatus from '@/Kiosk-Admin/components/CategoryToggleStatus';
import SubCategoryToggleStatus from '@/Kiosk-Admin/components/SubCategoryToggleStatus';
import ProductToggleStatus from '@/Kiosk-Admin/components/ProductToggleStatus';
import EditProduct from '@/Kiosk-Admin/components/Forms/Product-Item/edit-product';
import EditCategory from '@/Kiosk-Admin/components/Forms/CatergoryItem/edit-category';
import EditSubCategory from '@/Kiosk-Admin/components/Forms/SubCategoryItem/edit-subcategory';
import ImagePreviewCell from '@/Kiosk-Admin/components/Buttons/ImagePreviewCell';
import MultiplePreviewImage from '@/Kiosk-Admin/components/Buttons/MultiplePreviewImage';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export const userColumns: Column<User>[] = [
  { id: 'name',  label: 'Name'  },
  { id: 'email', label: 'Email' },
  { id: 'age',   label: 'Age', numeric: true },
];

export const Proditem: Column<ProductItem>[] = [
  {
    id: 'images',
    label: 'Images',
    render: (row) => (
      <MultiplePreviewImage images={row.images} productName={row.name} />
    ),
  },
  { id: 'category_name',    label: 'Category'    },
  {
    id: 'sub_category_name',
    label: 'Sub-Category',
    render: (row) => <span>{row.sub_category_name ?? '—'}</span>,
  },
  { id: 'item_code',        label: 'Item Code'   },
  { id: 'name',             label: 'Item Name'   },
  { id: 'item_description', label: 'Description' },
  { id: 'sku',              label: 'SKU'         },
  { id: 'price',            label: 'Item Price'  },
  { id: 'quantity',         label: 'Quantity'    },
  {
    id: 'color_variants',
    label: 'Color Variants',
    render: (row) => {
      const variants = row.color_variants ?? (row as ProductItem & { colorVariants?: ProductItem['color_variants'] }).colorVariants ?? [];
      if (!variants.length) return <span style={{ color: '#aaa' }}>—</span>;
      return (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {variants.map((v) => (
            <div
              key={v.id}
              title={v.color_name}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
            >
              {v.image_path ? (
                <img
                  src={`/storage/${v.image_path}`}
                  alt={v.color_name}
                  style={{ width: 62, height: 62, objectFit: 'cover', borderRadius: 4, border: '1px solid #e0dbd5' }}
                />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: 4, background: '#f5f2ee', border: '1px solid #e0dbd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  🎨
                </div>
              )}
              <span style={{ fontSize: 9, color: '#666', maxWidth: 46, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.color_name}
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'action',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProductToggleStatus id={row.id} status={row.status === 'Active'} />
        <EditProduct product={row} />
      </div>
    ),
  },
];

export const CatItem: Column<CategoryList>[] = [
  {
    id: 'image_path',
    label: 'Image',
    render: (row) => (
      <ImagePreviewCell imagePath={row.image_path} alt={row.name} />
    ),
  },
  { id: 'name', label: 'Category Name' },
  {
    id: 'actions',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CategoryToggleStatus id={row.id} status={row.status === 'Active'} />
        <EditCategory category={row} />
      </div>
    ),
  },
];

export const SubCatItem: Column<SubCategoryList>[] = [
  {
    id: 'image_path',
    label: 'Image',
    render: (row) => (
      <ImagePreviewCell imagePath={row.image_path} alt={row.name} />
    ),
  },
  {
    id: 'category',
    label: 'Category',
    render: (row) => <span>{row.category?.name ?? '—'}</span>,
  },
  { id: 'name', label: 'Sub-Category Name' },
  {
    id: 'actions',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SubCategoryToggleStatus id={row.id} status={row.status === 'Active'} />
        <EditSubCategory subCategory={row} />
      </div>
    ),
  },
];

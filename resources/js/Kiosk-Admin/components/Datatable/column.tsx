import { Column } from './types';
import { ProductItem } from '@/Kiosk-Admin/types/product-type';
import { CategoryList } from '@/Kiosk-Admin/types/category-types';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';
import { VariationList } from '@/Kiosk-Admin/types/variation-types';
import { AdsList } from '@/Kiosk-Admin/types/ads-types';

import CategoryToggleStatus from '@/Kiosk-Admin/components/CategoryToggleStatus';
import SubCategoryToggleStatus from '@/Kiosk-Admin/components/SubCategoryToggleStatus';
import ProductToggleStatus from '@/Kiosk-Admin/components/ProductToggleStatus';
import VariationToggleStatus from '@/Kiosk-Admin/components/VariationToggleStatus';
import AdsToggleStatus from '@/Kiosk-Admin/components/AdsToggleStatus';
import EditProduct from '@/Kiosk-Admin/components/Forms/Product-Item/edit-product';
import EditCategory from '@/Kiosk-Admin/components/Forms/CatergoryItem/edit-category';
import EditSubCategory from '@/Kiosk-Admin/components/Forms/SubCategoryItem/edit-subcategory';
import EditVariation from '@/Kiosk-Admin/components/Forms/VariationItem/edit-variation';
import EditAd from '@/Kiosk-Admin/components/Forms/AdsItem/edit-ad';
import ImagePreviewCell from '@/Kiosk-Admin/components/Buttons/ImagePreviewCell';
import MultiplePreviewImage from '@/Kiosk-Admin/components/Buttons/MultiplePreviewImage';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export const userColumns: Column<User>[] = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'age', label: 'Age', numeric: true },
];

export const Proditem: Column<ProductItem>[] = [
  {
    id: 'images',
    label: 'Images',
    render: (row) => (
      <div style={{ position: 'relative', display: 'inline-block', width: 48 }}>
        <MultiplePreviewImage images={row.images} productName={row.name} />
      </div>
    ),
  },
  { id: 'category_name', label: 'Category' },
  {
    id: 'sub_category_name',
    label: 'Sub-Category',
    render: (row) => <span>{row.sub_category_name ?? '—'}</span>,
  },
  { id: 'item_code', label: 'Item Code' },
  { id: 'name', label: 'Item Name' },
  { id: 'item_description', label: 'Description' },
  { id: 'sku', label: 'SKU' },
  { id: 'price', label: 'Item Price' },
  { id: 'quantity', label: 'Quantity' },
  {
    id: 'color_variants',
    label: 'Color Variants',
    render: (row) => {
      const variants =
        row.color_variants ??
        (row as ProductItem & { colorVariants?: ProductItem['color_variants'] }).colorVariants ??
        [];

      if (!variants.length) return <span style={{ color: '#aaa' }}>—</span>;
      return <span>{variants.length} variant Available{variants.length > 1 ? 's' : ''}</span>;
    },
  },
  {
    id: 'variant_quantity',
    label: 'Quantity Variants',
    render: (row) => {
      const variants = row.color_variants ?? [];
      if (!variants.length) return <span style={{ color: '#aaa' }}>—</span>;

      const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
      const soldOut = totalQuantity <= 0;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ color: soldOut ? '#ef4444' : 'inherit', fontWeight: soldOut ? 700 : 400 }}>
            {totalQuantity}
          </span>
          {soldOut && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              padding: '2px 8px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
            }}>
              SOLD OUT
            </span>
          )}
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

export const renderProductExpandedRow = (row: ProductItem) => {
  const variants =
    row.color_variants ??
    (row as ProductItem & { colorVariants?: ProductItem['color_variants'] }).colorVariants ??
    [];

  if (!variants.length) {
    return <span style={{ color: '#888' }}>No color variants for this product.</span>;
  }

  return (
    <div style={{ padding: '4px 8px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#5a2d82', marginBottom: 10 }}>
        Color Variants
      </div>
      <div style={{ border: '1px solid #e9e0f3', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 120px',
            gap: 12,
            padding: '10px 12px',
            background: '#f7f2fc',
            fontSize: 12,
            fontWeight: 700,
            color: '#5a2d82',
            borderBottom: '1px solid #e9e0f3',
          }}
        >
          <span>Image</span>
          <span>Color</span>
          <span>Quantity</span>
        </div>
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px',
              gap: 12,
              alignItems: 'center',
              padding: '10px 12px',
              borderBottom: index < variants.length - 1 ? '1px solid #f0e8f7' : 'none',
            }}
          >
            <div>
              {variant.image_path ? (
                <img
                  src={`/${variant.image_path}`}
                  alt={variant.color_name}
                  style={{
                    width: 44,
                    height: 44,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #e0dbd5',
                    display: 'block',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 6,
                    border: '1px solid #e0dbd5',
                    background: '#f5f2ee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontSize: 12,
                  }}
                >
                  —
                </div>
              )}
            </div>
            <span style={{ fontWeight: 600, color: '#333' }}>{variant.color_name}</span>
            <span style={{ color: '#666' }}>{variant.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CatItem: Column<CategoryList>[] = [
  {
    id: 'image_path',
    label: 'Image',
    render: (row) => (
      <ImagePreviewCell imagePath={row.image_path ? `/${row.image_path}` : undefined} alt={row.name} />
    ),
  },
  { id: 'name', label: 'Category Name' },
  { id: 'description', label: 'Description'},
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
      <ImagePreviewCell imagePath={row.image_path ? `/${row.image_path}` : undefined} alt={row.name} />
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

export const VariationItem: Column<VariationList>[] = [
  {
    id: 'image_path',
    label: 'Image',
    render: (row) => (
      <ImagePreviewCell imagePath={row.image_path ? `/${row.image_path}` : undefined} alt={row.name} />
    ),
  },
  { id: 'name', label: 'Variation Name' },
  {
    id: 'sub_category',
    label: 'Sub-Category',
    render: (row) => <span>{row.sub_category?.name ?? '—'}</span>,
  },
  {
    id: 'actions',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <VariationToggleStatus id={row.id} status={row.status === 'Active'} />
        <EditVariation variation={row} />
      </div>
    ),
  },
];

export const AdsItem: Column<AdsList>[] = [
  {
    id: 'file_path',
    label: 'Preview',
    render: (row) =>
      row.type === 'image' ? (
        <ImagePreviewCell imagePath={`/${row.file_path}`} alt={row.title} />
      ) : (
        <video
          src={`/${row.file_path}`}
          style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #e5e7eb' }}
          muted
        />
      ),
  },
  { id: 'title',      label: 'Title' },
  { id: 'type',       label: 'Type' },
  { id: 'sort_order', label: 'Order' },
  { id: 'duration',   label: 'Duration (s)' },
  {
    id: 'actions',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AdsToggleStatus id={row.id} status={row.status === 'Active'} />
        <EditAd ad={row} />
      </div>
    ),
  },
];

import { Column } from './types';
import { ProductItem } from '@/Kiosk-Admin/types/product-type';

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
        id: 'id',
        label: 'Item_ID',
    },
    {
        id: 'name',
        label: 'Item Name',
    },
    {
        id: 'sku',
        label: 'SKU',
    },
    {
        id: 'categoryId',
        label: 'Category',
    },
    {
        id: 'price',
        label: 'Item Price',
    },
        {
        id: 'item_description',
        label: 'Description',
    },

];
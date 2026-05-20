import { Column } from './types';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
export interface Item {
  id: number;
  name: string;
  sku: number;
  categoryId: number;
  price: number;
  description: string;
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


export const itemCat: Column<Item>[] = [
    {
        id: 'id',
        label: 'Item_ID',
    },
    {
        id: 'name',
        label: 'Item Name',
    },
    {
        id: 'categoryId',
        label: 'Category',
    },
    {
        id: 'sku',
        label: 'SKU',
    },
    {
        id: 'price',
        label: 'Item Price',
    },
        {
        id: 'description',
        label: 'Description',
    },

];
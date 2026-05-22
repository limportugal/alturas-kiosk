import { create } from 'zustand';

//Storing Datas

interface ProductTypeStore {
    item_code?: string | null;
    name?: string;
    sku?: string;
    categoryId?:number;
    price?: number;
    quantity?: number;
    item_description: string;
    status : string;
    image_path: string;
    
    setItemCode: (item_code: string) => void;
    setName: (name: string) => void;
    setSku: (sku: string) => void;
    setPrice: (price: number) => void;
    setQuantity: (quantity: number) => void;
    setCategoryId: (categoryId: number) => void;
    setItemDescriptions: (item_description: string) => void;
    setStatus: (status: string) => void;
    setImagePath: (image_path: string) => void;
    resetForm: () => void;
}

export const useProductStore = create<ProductTypeStore>((set) => ({
    item_code: null,
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    categoryId: 0,
    item_description: '',
    status: '',
    image_path: '',

    setItemCode: (item_code) => set(() => ({ item_code })),
    setName: (name) => set(() => ({ name })),
    setSku: (sku) => set(() => ({ sku })),
    setPrice: (price) => set(() => ({ price })),
    setQuantity: (quantity) => set(() => ({ quantity })),
    setCategoryId: (categoryId) => set(() => ({ categoryId })),
    setItemDescriptions: (item_description) => set(() => ({ item_description })),
    setStatus: (status) => set(() => ({ status })),
    setImagePath: (image_path) => set(() => ({ image_path })),
    resetForm: () => set(() => ({ 
        item_code: null,
        name: '',
        sku: '',
        price: 0,
        quantity: 0,
        categoryId: 0,
        item_description: '',
        status: '',
        image_path: '',
     })),
}));

import { create } from 'zustand';

interface ProductImage {
  id?: number;
  image_path: string;
}

//Storing Datas

interface ProductTypeStore {
    item_code?: string | null;
    name?: string;
    sku?: string;
    item_category_id?: number;
    price?: number;
    quantity?: number;
    item_description: string;
    status : string;
    image_path: string;
    existingImages: ProductImage[];
    removedImageIds: number[]; 
    
    setItemCode: (item_code: string) => void;
    setName: (name: string) => void;
    setSku: (sku: string) => void;
    setPrice: (price: number) => void;
    setQuantity: (quantity: number) => void;
    setItemCategoryId: (item_category_id: number) => void;
    setItemDescriptions: (item_description: string) => void;
    setStatus: (status: string) => void;
    setExistingImages: (images: ProductImage[]) => void;
    removeExistingImage: (id: number) => void;
    resetForm: () => void;
}

export const useProductStore = create<ProductTypeStore>((set) => ({
    item_code: null,
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    item_category_id: 0,
    item_description: '',
    status: '',
    image_path: '',
    existingImages: [],
    removedImageIds: [],
    

    setItemCode: (item_code) => set(() => ({ item_code })),
    setName: (name) => set(() => ({ name })),
    setSku: (sku) => set(() => ({ sku })),
    setPrice: (price) => set(() => ({ price })),
    setQuantity: (quantity) => set(() => ({ quantity })),
    setItemCategoryId: (item_category_id) => set(() => ({ item_category_id })),
    setItemDescriptions: (item_description) => set(() => ({ item_description })),
    setStatus: (status) => set(() => ({ status })),
    setExistingImages: (existingImages) => set({ existingImages }),
    removeExistingImage: (id) =>
    set((state) => ({
      existingImages:  state.existingImages.filter((img) => img.id !== id),
      removedImageIds: [...state.removedImageIds, id],
    })),
    resetForm: () => set(() => ({ 
        item_code: null,
        name: '',
        sku: '',
        price: 0,
        quantity: 0,
        item_category_id: 1,
        item_description: '',
        status: '',
        image_path: '',
        existingImages: [],
        removedImageIds: [],
     })),
}));

import { create } from 'zustand';

interface SubCategoryTypeStore {
    item_category_id: number;
    name: string;
    image_path: string;
    status: string;

    setItem_category_id: (item_category_id: number) => void;
    setName:             (name: string)             => void;
    setImage_path:       (image_path: string)       => void;
    setStatus:           (status: string)           => void;
    resetForm:           ()                         => void;
}

export const useSubCategoryStore = create<SubCategoryTypeStore>((set) => ({
    item_category_id: 0,
    name:             '',
    image_path:       '',
    status:           'Active',

    setItem_category_id: (item_category_id) => set((state) => ({ ...state, item_category_id })),
    setName:             (name)             => set((state) => ({ ...state, name })),
    setImage_path:       (image_path)       => set((state) => ({ ...state, image_path })),
    setStatus:           (status)           => set((state) => ({ ...state, status })),
    resetForm:           ()                 => set({ item_category_id: 0, name: '', image_path: '', status: 'Active' }),
}));

import { create } from 'zustand';

interface VariationTypeStore {
    name:            string;
    image_path:      string;
    status:          string;
    sub_category_id: number | null;

    setName:            (name: string)            => void;
    setImage_path:      (image_path: string)      => void;
    setStatus:          (status: string)          => void;
    setSubCategoryId:   (id: number | null)       => void;
    resetForm:          ()                        => void;
}

export const useVariationStore = create<VariationTypeStore>((set) => ({
    name:            '',
    image_path:      '',
    status:          'Active',
    sub_category_id: null,

    setName:          (name)          => set((state) => ({ ...state, name })),
    setImage_path:    (image_path)    => set((state) => ({ ...state, image_path })),
    setStatus:        (status)        => set((state) => ({ ...state, status })),
    setSubCategoryId: (sub_category_id) => set((state) => ({ ...state, sub_category_id })),
    resetForm:        ()              => set({ name: '', image_path: '', status: 'Active', sub_category_id: null }),
}));

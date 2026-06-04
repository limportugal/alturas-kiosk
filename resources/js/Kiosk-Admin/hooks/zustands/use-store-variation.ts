import { create } from 'zustand';

interface VariationTypeStore {
    name:       string;
    image_path: string;
    status:     string;

    setName:       (name: string)       => void;
    setImage_path: (image_path: string) => void;
    setStatus:     (status: string)     => void;
    resetForm:     ()                   => void;
}

export const useVariationStore = create<VariationTypeStore>((set) => ({
    name:       '',
    image_path: '',
    status:     'Active',

    setName:       (name)       => set((state) => ({ ...state, name })),
    setImage_path: (image_path) => set((state) => ({ ...state, image_path })),
    setStatus:     (status)     => set((state) => ({ ...state, status })),
    resetForm:     ()           => set({ name: '', image_path: '', status: 'Active' }),
}));

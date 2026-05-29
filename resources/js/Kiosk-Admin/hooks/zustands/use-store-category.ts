import { create } from 'zustand';


interface CategoryTypeStore {
    name?:string;
    image_path:string;
    status:string;

    setName:(name:string) => void;
    setImage_path:(image_path:string) => void;
    setStatus:(status:string) => void;
    resetForm: () => void;
}

export const useCategoryStore = create<CategoryTypeStore>((set) => ({
    name:'',
    image_path:'',
    status:'Active',

    setName:(name:string) => set((state) => ({...state, name})),
    setImage_path:(image_path:string) => set((state) => ({...state, image_path})),
    setStatus:(status:string) => set((state) => ({...state, status})),
    resetForm:() => set({name:'', image_path:'', status:'Active'})
}));

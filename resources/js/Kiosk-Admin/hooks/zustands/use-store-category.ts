import { create } from 'zustand';


interface CategoryTypeStore {
    name?:string;
    description:string;
    image_path:string;
    status:string;

    setName:(name:string) => void;
    setDescription:(description:string) => void;
    setImage_path:(image_path:string) => void;
    setStatus:(status:string) => void;
    resetForm: () => void;
}

export const useCategoryStore = create<CategoryTypeStore>((set) => ({
    name:'',
    description:'',
    image_path:'',
    status:'Active',

    setName:(name:string) => set((state) => ({...state, name})),
    setDescription:(description:string) => set((state) => ({...state, description})),
    setImage_path:(image_path:string) => set((state) => ({...state, image_path})),
    setStatus:(status:string) => set((state) => ({...state, status})),
    resetForm:() => set({
        name:'',
        description: '', 
        image_path:'', 
        status:'Active'
    })
}));

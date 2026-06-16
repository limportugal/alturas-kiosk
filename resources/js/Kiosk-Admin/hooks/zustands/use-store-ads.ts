import { create } from 'zustand';

interface AdsStore {
    title:      string;
    sort_order: number;
    duration:   number;
    status:     string;

    setTitle:      (title: string)      => void;
    setSortOrder:  (sort_order: number) => void;
    setDuration:   (duration: number)   => void;
    setStatus:     (status: string)     => void;
    resetForm:     ()                   => void;
}

export const useAdsStore = create<AdsStore>((set) => ({
    title:      '',
    sort_order: 0,
    duration:   15,
    status:     'Active',

    setTitle:     (title)      => set((state) => ({ ...state, title })),
    setSortOrder: (sort_order) => set((state) => ({ ...state, sort_order })),
    setDuration:  (duration)   => set((state) => ({ ...state, duration })),
    setStatus:    (status)     => set((state) => ({ ...state, status })),
    resetForm:    ()           => set({ title: '', sort_order: 0, duration: 15, status: 'Active' }),
}));

export interface LogoList {
    id: number;
    name: string;
    image_path: string;
    status: 'Active' | 'Inactive';
    created_at?: string;
    updated_at?: string;
}

export interface LogoStorePayload {
    name: string;
    image: File;
    status: 'Active' | 'Inactive';
}

export interface LogoUpdatePayload {
    name: string;
    image?: File | null;
    status: 'Active' | 'Inactive';
}

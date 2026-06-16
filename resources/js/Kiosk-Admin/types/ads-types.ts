export interface AdsList {
    id: number;
    title: string;
    file_path: string;
    type: 'image' | 'video';
    sort_order: number;
    duration: number;
    status: string;
    actions?: string;
}

export interface CreateAdPayload {
    title: string;
    file_path?: File | null;
    sort_order: number;
    duration: number;
    status: string;
}

export interface UpdateAdPayload extends CreateAdPayload {
    id: number;
}

export interface SubCategoryList {
    id: number;
    item_category_id: number;
    name: string;
    image_path?: string;
    status: string;
    sort_order?: number;
    category?: { id: number; name: string };
    actions?: string;
}

export interface SubCategoryPayload {
    item_category_id: number;
    name: string;
    image_path?: File | null;
    status: string;
}

export interface CreateSubCategoryPayload extends SubCategoryPayload {}

export interface UpdateSubCategoryPayload extends SubCategoryPayload {
    id: number;
    remove_image?: boolean;
}

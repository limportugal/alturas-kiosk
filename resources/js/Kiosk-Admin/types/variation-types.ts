export interface VariationList {
    id: number;
    name: string;
    image_path?: string | null;
    status: string;
    actions?: string;
}

export interface DropdownVariation {
    id: number;
    name: string;
    image_path?: string | null;
}

export interface VariationPayload {
    name: string;
    image_path?: File | null;
    status: string;
}

export interface CreateVariationPayload extends VariationPayload {}

export interface UpdateVariationPayload extends VariationPayload {
    id: number;
    remove_image?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

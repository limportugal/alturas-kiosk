export interface VariationList {
    id: number;
    name: string;
    image_path?: string | null;
    status: string;
    actions?: string;
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

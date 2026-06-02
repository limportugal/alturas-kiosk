import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export interface PublicSubCategory {
    id: number;
    item_category_id: number;
    name: string;
    image_path?: string | null;
    status: string;
}

export interface PublicSubCategoryListResponse {
    data: PublicSubCategory[];
}

export const SubCategoriesPublicServices = async (): Promise<PublicSubCategoryListResponse> => {
    const response = await api.get(relativeRoute('sub-category-public-list'));
    return response.data;
};

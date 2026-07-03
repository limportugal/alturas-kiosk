import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

type SubCategoryRowReOrderingPayload = {
    ids : number[];
}

export const SubCategoryReOrderingService = async (
    payload : SubCategoryRowReOrderingPayload
): Promise<{message: string}> => {
    const response = await api.put(relativeRoute('sub-category.reorder'),payload);
    return response.data;
}
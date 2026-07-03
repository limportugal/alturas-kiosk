import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

type CategoryRowReOrderingPayload = {
    ids : number[];
}
export const CategoryReOrderingService = async (
    payload : CategoryRowReOrderingPayload
): Promise<{message: string}> => {
    const response = await api.put(relativeRoute('category.reorder'),payload);
    return response.data;
}
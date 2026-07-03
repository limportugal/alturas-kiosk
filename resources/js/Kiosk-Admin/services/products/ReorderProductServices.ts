import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';


type ProductRowReOrderingPayload = {
    ids : number[];
}
export const ProductReOrderingService = async (
    payload : ProductRowReOrderingPayload
): Promise<{message: string}> => {
    const response = await api.put(relativeRoute('product.reorder'),payload);
    return response.data;
}


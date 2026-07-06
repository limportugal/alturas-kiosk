import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';


type AdRowReOrderingPayload = {
    ids : number[];
}
export const AdsReOrderingService = async (
    payload : AdRowReOrderingPayload
): Promise<{message: string}> => {
    const response = await api.put(relativeRoute('ads-reorder'),payload);
    return response.data;
}


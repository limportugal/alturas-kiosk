import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

type VariationRowReOrderingPayload = {
    ids: number [];
}

export const VariationsReOrderdingService = async ( payload : VariationRowReOrderingPayload):Promise<{message:string}> => {
    const response = await api.put(relativeRoute('variations-reorder'), payload);
    return response.data;
}
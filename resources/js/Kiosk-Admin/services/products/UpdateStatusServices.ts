import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const updateStatus = async( id: number) => {    
    const response = await api.put(relativeRoute('products.toggle-status', id));
    return response.data;

}

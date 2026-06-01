import api from '@/lib/axios';
import { route } from 'ziggy-js';

export const updateStatus = async( id: number) => {    
    const response = await api.put(route('products.toggle-status', id));
    return response.data;

}

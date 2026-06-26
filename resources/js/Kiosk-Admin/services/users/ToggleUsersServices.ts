import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const updateUserStatus = async( id: number) => {
    const response = await api.patch(relativeRoute('user.toggle', {id}));
    return response.data;
}
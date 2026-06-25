import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UserListItem } from '@/Kiosk-Admin/types/user-types';

export const GetUsersListServices = async (): Promise<{ data: UserListItem[] }> => {
    const response = await api.get(relativeRoute('users.list'));
    return response.data;
};

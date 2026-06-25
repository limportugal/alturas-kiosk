import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UserStorePayload, UserListItem } from '@/Kiosk-Admin/types/user-types';

export const CreateUserService = async (
    payload: UserStorePayload
): Promise<{ created: UserListItem }> => {
    const response = await api.post(relativeRoute('users.store'), payload);
    return response.data;
};

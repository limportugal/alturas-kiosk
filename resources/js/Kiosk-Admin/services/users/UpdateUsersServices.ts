import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UserUpdatePayload, UserListItem } from '@/Kiosk-Admin/types/user-types';

export const UpdateUserService = async ({
    id,
    payload,
}: {
    id: number;
    payload: UserUpdatePayload;
}): Promise<{ updated: UserListItem }> => {
    const response = await api.put(relativeRoute('users.update', { id }), payload);
    return response.data;
};

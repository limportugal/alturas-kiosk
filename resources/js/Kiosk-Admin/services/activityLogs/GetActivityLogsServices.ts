import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { ActivityLogPaginated } from '@/Kiosk-Admin/types/activity-type';

export const GetActivityLogServices = async (): Promise<ActivityLogPaginated> =>{
    const response = await api.get(relativeRoute('activity-log.list'));
    return response.data;
}
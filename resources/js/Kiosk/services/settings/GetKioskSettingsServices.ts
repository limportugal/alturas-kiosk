import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export interface KioskSettings {
    idle_timeout_seconds: number;
    idle_enabled: boolean;
}

export const KioskSettingsPublicService = async (): Promise<KioskSettings> => {
    const response = await api.get(relativeRoute('kiosk.settings.show'));
    return response.data;
};

import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export interface KioskSettings {
    idle_timeout_seconds: number;
    idle_enabled: boolean;
}

export const KioskSettingsPublicService = async (): Promise<KioskSettings> => {
    const response = await api.get(relativeRoute('kiosk.settings.show'), {
        params: { _t: Date.now() },
        headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
        },
    });
    return response.data;
};

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Screensaver from './components/Screensaver';
import MainPage from '@/Kiosk/MainPage';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { KioskSettingsPublicService } from '@/Kiosk/services/settings/GetKioskSettingsServices';

const queryClient = new QueryClient();

const KIOSK_W = 1080;
const KIOSK_H = 1920;
const FALLBACK_TIMEOUT = 60_000; // used while setting is loading

function ScaledKiosk() {
    const [scale, setScale]     = useState(1);
    const [started, setStarted] = useState(false);

    const { data: settings } = useDynamicQuery(['kiosk-settings'], KioskSettingsPublicService);
    const idleTimeout = started && settings?.idle_enabled !== false
        ? (settings?.idle_timeout_seconds ?? 60) * 1000
        : undefined; // disabled on screensaver

    useEffect(() => {
        const update = () => {
            const scaleX = window.innerWidth / KIOSK_W;
            const scaleY = window.innerHeight / KIOSK_H;
            setScale(Math.min(scaleX, scaleY));
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            overflow: 'hidden',
        }}>
            <div style={{
                width: KIOSK_W,
                height: KIOSK_H,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                flexShrink: 0,
            }}>
                {started ? (
                    <MainPage
                        idleTimeoutMs={idleTimeout}
                        onIdleReset={() => setStarted(false)}
                    />
                ) : (
                    <Screensaver onStart={() => setStarted(true)} />
                )}
            </div>
        </div>
    );
}

export default function KioskApp() {
    return (
        <QueryClientProvider client={queryClient}>
            <ScaledKiosk />
        </QueryClientProvider>
    );
}

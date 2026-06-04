import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

import { ToastProvider } from '@/Kiosk-Admin/components/provider/ToastProvider';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import api from './lib/axios';
import SessionGuard from '@/Components/SessionGuard';

const appName = import.meta.env.VITE_APP_NAME || 'Alturas';

const queryClient = new QueryClient();

const pages = {
    ...import.meta.glob('./Pages/**/*.jsx'),
    ...import.meta.glob('./Pages/**/*.tsx'),
};

createInertiaApp({
    title: (title: string) => `${title} - ${appName}`,
    resolve: (name: string) => {
        const page =
            pages[`./Pages/${name}.tsx`] ?? pages[`./Pages/${name}.jsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page();
    },
    setup({ el, App, props }: { el: Element; App: any; props: any }) {
           // Fetch CSRF once on app boot
          api.get('/sanctum/csrf-cookie').catch(() => {});

        const root = createRoot(el);
         return root.render(
            <ToastProvider>
                <QueryClientProvider client={queryClient}>
                    <SessionGuard App ={App} props={props} />
                </QueryClientProvider>
            </ToastProvider>
        );
    },
    progress: {
        color: '#ad21c0ff',
    },
});
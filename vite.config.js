import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server:{
        //  host: '192.168.0.131',
          host: '192.168.0.137',
         cors: true,
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                'resources/js/Kiosk-Screen-Saver/Kiosk.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
});

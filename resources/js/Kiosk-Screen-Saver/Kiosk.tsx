import React from "react";
import ReactDOM from 'react-dom/client';
import "../../css/app.css";
import KioskApp from '@/Kiosk-Screen-Saver/KioskApp';

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error('App root element is missing');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <KioskApp />
    </React.StrictMode>
);

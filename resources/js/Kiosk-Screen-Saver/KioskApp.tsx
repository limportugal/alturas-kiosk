import { useState } from 'react';
import Screensaver from './components/Screensaver';
import MainPage from './components/MainPage';

export default function KioskApp() {
    const [started, setStarted] = useState(false);

    return started ? (
        <MainPage />
    ) : (
        <Screensaver onStart={() => setStarted(true)} />
    );
}

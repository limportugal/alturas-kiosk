type ScreensaverProps = {
    onStart: () => void;
};

export default function Screensaver({ onStart }: ScreensaverProps) {
    return (
        <main
            className="relative h-screen w-screen overflow-hidden bg-black"
            onClick={onStart}
            onTouchStart={onStart}
        >
            <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/videos/screen_saver_alturas.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-x-0 bottom-20 text-center text-white">
                <p className="text-5xl font-bold tracking-wide">
                    Tap anywhere to start
                </p>
            </div>
        </main>
    );
}

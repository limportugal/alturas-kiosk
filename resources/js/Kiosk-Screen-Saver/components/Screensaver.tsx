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
                <source
                    src="/videos/screen_saver_alturas.mp4"
                    type="video/mp4"
                />
            </video>

            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/70" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
                <p className="text-sm uppercase tracking-[0.6em] text-white/70">
                    Alturas Kiosk
                </p>
                <h1 className="mt-6 max-w-[700px] text-5xl font-bold leading-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]">
                    Touch the screen to begin
                </h1>
                <p className="mt-6 max-w-[540px] text-lg text-white/80">
                    The screensaver is running. If your video is very dark, this
                    overlay confirms the kiosk home screen is active.
                </p>
            </div>

            <div className="absolute inset-x-0 bottom-16 flex justify-center">
                <div className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-xl font-semibold tracking-[0.2em] text-white backdrop-blur-sm">
                    TAP ANYWHERE
                </div>
            </div>
        </main>
    );
}

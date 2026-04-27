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

            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-x-0 top-[68%] flex justify-center">
                <div className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-xl font-semibold tracking-[0.2em] text-white backdrop-blur-sm">
                    TAP ANYWHERE TO START
                </div>
            </div>
        </main>
    );
}

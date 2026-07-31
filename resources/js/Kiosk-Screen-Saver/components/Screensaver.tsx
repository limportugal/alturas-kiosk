import { useState, useEffect, useRef } from 'react';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { GetPublicAdsServices } from '@/Kiosk/services/ads/GetPublicAdsServices';
import { ProductPublicServices } from '@/Kiosk/services/product/GetProductListServices';
import { ScreenSaverFallback } from './ScreenSaverFallback';

type ScreensaverProps = {
    onStart: () => void;
    onProductSelect?: (productId: number | string) => void;
};

export default function Screensaver({ onStart, onProductSelect }: ScreensaverProps) {
    const { data: adsData } = useDynamicQuery(
        ['ads-public-list'],
        GetPublicAdsServices,
        { staleTime: 30_000, refetchInterval: 30_000 }
    );
    const { data: productsData } = useDynamicQuery(
        ['screensaver-products'],
        ProductPublicServices,
        { staleTime: 30_000, refetchInterval: 30_000 }
    );

    const ads = adsData?.data ?? [];
    const products = (productsData?.data ?? []).map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image_path: product.images?.[0]?.image_path ?? null,
        category: product.category_name,
    }));

    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentAd = ads[currentIndex];
    const duration  = (currentAd?.duration ?? 15) * 1000;

    // Advance to the next ad after each slide's duration
    useEffect(() => {
        if (!ads.length) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, duration);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [currentIndex, ads.length, duration]);

    // Reset to first slide when ad list changes
    useEffect(() => { setCurrentIndex(0); }, [ads.length]);

    if (!ads.length) {
        return (
            <ScreenSaverFallback
                visible
                onDismiss={onStart}
                onProductSelect={(product) => {
                    onProductSelect?.(product.id);
                }}
                products={products}
            />
        );
    }

    return (
        <main
            onClick={onStart}
            onTouchStart={onStart}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: '#000',
            }}
        >
            {ads.map((ad, i) => (
                <div
                    key={ad.id}
                    style={{
                        position:      'absolute',
                        top:           0,
                        left:          0,
                        width:         '100%',
                        height:        '100%',
                        opacity:       i === currentIndex ? 1 : 0,
                        transition:    'opacity 0.8s ease',
                        pointerEvents: 'none',
                    }}
                >
                    {ad.type === 'video' ? (
                        <ScreensaverVideo
                            src={`/${ad.file_path}`}
                            isActive={i === currentIndex}
                        />
                    ) : (
                        <img
                            src={`/${ad.file_path}`}
                            alt={ad.title}
                            style={{
                                position:   'absolute',
                                top:        0,
                                left:       0,
                                width:      '100%',
                                height:     '100%',
                                objectFit:  'cover',
                            }}
                        />
                    )}
                </div>
            ))}

            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                pointerEvents: 'none',
                zIndex: 10,
            }} />
            <TapPrompt />
        </main>
    );
}

function ScreensaverVideo({ src, isActive }: { src: string; isActive: boolean }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            video.currentTime = 0;
            video.play().catch((err) => {
                console.warn("Failed to play video automatically:", err);
            });
        } else {
            video.pause();
        }
    }, [isActive]);

    return (
        <video
            ref={videoRef}
            src={src}
            autoPlay={isActive}
            muted
            loop
            playsInline
            style={{
                position:   'absolute',
                top:        0,
                left:       0,
                width:      '100%',
                height:     '100%',
                objectFit:  'cover',
            }}
        />
    );
}

function TapPrompt() {
    return (
        <div
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                top: '68%',
                zIndex: 20,
                pointerEvents: 'none',
            }}
        >
            <div className="touch-start-prompt">
                TOUCH TO START!
            </div>
            <style>{`
                .touch-start-prompt {
                    padding: 22px 46px;
                    border: 3px solid rgba(255, 255, 255, 0.95);
                    border-radius: 9999px;
                    background: linear-gradient(135deg, rgba(90, 45, 130, 0.96), rgba(31, 22, 43, 0.96));
                    color: #fff;
                    font-family: Arial, sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: 0.18em;
                    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.65);
                    backdrop-filter: blur(8px);
                    animation: touchPromptPulse 1.8s ease-in-out infinite;
                    will-change: transform, box-shadow;
                }

                @keyframes touchPromptPulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow:
                            0 0 0 7px rgba(255, 255, 255, 0.14),
                            0 12px 30px rgba(0, 0, 0, 0.55);
                    }

                    50% {
                        transform: scale(1.07);
                        box-shadow:
                            0 0 0 13px rgba(255, 255, 255, 0.24),
                            0 16px 42px rgba(0, 0, 0, 0.7);
                    }
                }
            `}</style>
        </div>
    );
}




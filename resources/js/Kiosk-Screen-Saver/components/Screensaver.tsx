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
                    onStart();
                }}
                products={products}
            />
        );
    }

    return (
        <main
            className="relative h-full w-full overflow-hidden bg-black"
            onClick={onStart}
            onTouchStart={onStart}
            style={{ position: 'absolute', inset: 0 }}
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
                        <video
                            src={`/${ad.file_path}`}
                            autoPlay={i === currentIndex}
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

            <div className="absolute inset-0 bg-black/10" />
            <TapPrompt />
        </main>
    );
}

function TapPrompt() {
    return (
        <div className="absolute inset-x-0 top-[68%] flex justify-center" style={{ pointerEvents: 'none' }}>
            <div className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-xl font-semibold tracking-[0.2em] text-white backdrop-blur-sm">
                TAP ANYWHERE TO START
            </div>
        </div>
    );
}

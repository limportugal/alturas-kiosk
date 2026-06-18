
import type { ReactNode } from "react";
import { useRef, useState, useEffect } from "react";

type PurpleBannerProps = {
    children: ReactNode;
    small?:boolean;
    marquee?:boolean;
    maxLength?: number;
    marqueeInsetLeft?: number;
    marqueeInsetRight?: number;
};

export function PurpleBannerV2({
    children,
    small,
    marquee = false,
    maxLength,
    marqueeInsetLeft = 0,
    marqueeInsetRight = 0,
}: PurpleBannerProps){
    let displayText = children;

    if(
        !marquee &&
        typeof children === 'string' && maxLength &&
        children.length > maxLength
    ) {
        displayText = `${children.slice(0, maxLength)}...`;
    }

const containerRef = useRef<HTMLDivElement>(null);
const textRef = useRef<HTMLDivElement>(null);

const [shouldMarquee, setShouldMarquee] = useState(false);
const [marqueeDistance, setMarqueeDistance] = useState(0);

useEffect(() => {
  const updateMarquee = () => {
    if (!containerRef.current || !textRef.current || !marquee) {
        setShouldMarquee(false);
        setMarqueeDistance(0);
        return;
    }

    const overflow = textRef.current.scrollWidth - containerRef.current.clientWidth;

    setShouldMarquee(overflow > 0);
    setMarqueeDistance(Math.max(0, overflow));
  };

  updateMarquee();
  window.addEventListener('resize', updateMarquee);

  return () => window.removeEventListener('resize', updateMarquee);
}, [children, marquee]);

    return (
        <div
            style={{
                background: "#5a2d82",
                padding: small ? "18px 0" : "28px 0",
                textAlign: "center",
                letterSpacing: 2,
                flexShrink: 0,
                
            }}
        >
            {marquee ? (
                <div
                ref={containerRef}
                style={{
                    marginLeft: marqueeInsetLeft,
                    marginRight: marqueeInsetRight,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}
                >
                <div
                    ref={textRef}
                    className={shouldMarquee ? 'purple-banner-marquee' : ''}
                    style={{
                    color: 'white',
                    fontSize: small ? 26 : 36,
                    fontWeight: 700,
                    fontFamily: 'Arial, sans-serif',
                    display: 'inline-block',
              
                    ['--purple-banner-marquee-distance' as string]: `${marqueeDistance}px`,
                    }}
                >
                    {displayText}
                </div>
                </div>
            ) : (
                <div
                    style={{
                        color: "white",
                        fontSize: small ? 26 : 36,
                        fontWeight: 700,
                        margin: 0,
                        
                        // fontFamily: 'monospace',
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    {displayText}
                </div>
            )}

        </div>
    )
}

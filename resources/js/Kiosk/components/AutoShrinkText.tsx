import React, { useCallback, useLayoutEffect, useRef } from "react";

type AutoShrinkTextProps = {
    children: React.ReactNode;
    minFontSize?: number;
    maxFontSize?: number;
    className?: string;
    style?: React.CSSProperties;
    singleLine?: boolean;
};

export default function AutoShrinkText({
    children,
    minFontSize = 12,
    maxFontSize = 24,
    className,
    style,
    singleLine = true,
}: AutoShrinkTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const resizeText = useCallback(() => {
        const container = containerRef.current;
        const text = textRef.current;

        if (!container || !text) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (containerWidth <= 0) return;

        let low = minFontSize;
        let high = maxFontSize;
        let best = minFontSize;

        for (let i = 0; i < 12; i++) {
            const mid = (low + high) / 2;

            text.style.fontSize = `${mid}px`;

            const widthFits = text.scrollWidth <= containerWidth + 1;
            const heightFits =
                containerHeight <= 0 || text.scrollHeight <= containerHeight + 1;

            if (widthFits && heightFits) {
                best = mid;
                low = mid;
            } else {
                high = mid;
            }
        }

        text.style.fontSize = `${Math.floor(best)}px`;
    }, [minFontSize, maxFontSize]);

    useLayoutEffect(() => {
        resizeText();

        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            resizeText();
        });

        observer.observe(container);

        document.fonts?.ready.then(() => {
            resizeText();
        });

        return () => {
            observer.disconnect();
        };
    }, [children, resizeText]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                ...style,
            }}
        >
            <span
                ref={textRef}
                style={{
                    display: "inline-block",
                    maxWidth: "100%",
                    whiteSpace: singleLine ? "nowrap" : "normal",
                    lineHeight: 1.15,
                }}
            >
                {children}
            </span>
        </div>
    );
}
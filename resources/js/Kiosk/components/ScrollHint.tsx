import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

interface ScrollHintProps {
    children: ReactNode;
    text?: string;
    wrapperStyle?: CSSProperties;
    scrollAreaStyle?: CSSProperties;
    scaleCompensation?: number;
}

export function ScrollHint({
    children,
    text = "Scroll for more",
    wrapperStyle,
    scrollAreaStyle,
    scaleCompensation = 1,
}: ScrollHintProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showHint, setShowHint] = useState(false);

    const hintFontSize = 22 / scaleCompensation;
    const arrowFontSize = 22 / scaleCompensation;
    const hintPaddingTop = 32 / scaleCompensation;
    const hintPaddingBottom = 5 / scaleCompensation;

    const checkScroll = () => {
        const element = scrollRef.current;

        if (!element) return;

        const hasScrollableContent =
            element.scrollHeight > element.clientHeight;

        const isAtBottom =
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 5;

        setShowHint(hasScrollableContent && !isAtBottom);
    };

    useEffect(() => {
        checkScroll();

        const element = scrollRef.current;
        if (!element) return;

        element.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);

        const observer = new ResizeObserver(checkScroll);
        observer.observe(element);

        return () => {
            element.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
            observer.disconnect();
        };
    }, [children]);

    return (
        <div
            style={{
                position: "relative",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                ...wrapperStyle,
            }}
        >
            <div
                ref={scrollRef}
                style={{
                    height: "100%",
                    overflowY: "auto",
                    ...scrollAreaStyle,
                }}
            >
                {children}
            </div>

            {showHint && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        padding: `${hintPaddingTop}px 0 ${hintPaddingBottom}px`,
                        pointerEvents: "none",
                        background:
                            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.98) 65%)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            color: "#6b2fa0",
                            fontSize: hintFontSize,
                            fontWeight: 700,
                        }}
                    >
                        <span>{text}</span>
                        <span
                            style={{
                                fontSize: arrowFontSize,
                                lineHeight: 1,
                                animation: "scrollHint 1.2s infinite",
                            }}
                        >
                            ↓
                        </span>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes scrollHint {
                        0%, 100% {
                            transform: translateY(0);
                        }

                        50% {
                            transform: translateY(4px);
                        }
                    }
                `}
            </style>
        </div>
    );
}

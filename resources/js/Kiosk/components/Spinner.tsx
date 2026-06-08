interface SpinnerProps {
    size?: number;
    color?: string;
    thickness?: number;
}

export function Spinner({ size = 18, color = "#fff", thickness = 2.5 }: SpinnerProps) {
    return (
        <>
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                style={{ animation: "kiosk-spin 0.75s linear infinite", flexShrink: 0 }}
            >
                {/* Track */}
                <circle
                    cx="12" cy="12" r="10"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeOpacity={0.25}
                />
                {/* Arc */}
                <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                />
            </svg>
            <style>{`
                @keyframes kiosk-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}

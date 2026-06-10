interface BadgeProps {
    value: number | string;
    show?: boolean;
    style?: React.CSSProperties;
    focused?: boolean;
}

export function Badge({
    value,
    show = true,
    style,
    focused = false,
}: BadgeProps){

    if(!show) return null;

    return (
        <span
            style={{
                position: "absolute",
                top: -20,
                right: -10,
                background: "#ef4444",
                color: "#fff",
                borderRadius: "1em",
                minWidth: "1.8em",
                height: "1.8em",
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1,
                padding: "0 0.4em",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                border: "2px solid #fff",
                boxSizing: "border-box",
                boxShadow: focused
                    ? "0 0 0 4px rgba(90,45,130,0.4)"
                    : undefined,
                ...style,
            }}
        >
            {value}
        </span>
    );
}

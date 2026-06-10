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
                borderRadius: "50%",
                minWidth: 45,
                height: 45,
                fontSize: 30,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
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
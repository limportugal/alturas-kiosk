interface ArrowIconProps {
  direction?: "left" | "right" | "up" | "down";
  size?: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
}

export function ArrowIcon({
  direction = "left",
  size = 24,
  color = "currentColor",
  strokeWidth = 3,
  label,
}: ArrowIconProps) {
  const rotations = {
    right: "rotate(0deg)",
    down: "rotate(90deg)",
    left: "rotate(180deg)",
    up: "rotate(-90deg)",
  };

  return (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize:30,
            gap: 6,
        }}
        >
        <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
            transform: rotations[direction],
            flexShrink: 0,
        }}
        fill="none"
        >
        <path
            d="M8 5L16 12L8 19"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </svg>
        {label && <span>{label}</span>}
    </span>
  );
}
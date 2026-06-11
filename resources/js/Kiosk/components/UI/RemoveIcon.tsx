interface RemoveIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

export function RemoveIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2.5,
  filled = false,
}: RemoveIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={filled ? color : "none"}
        stroke={filled ? "none" : color}
        strokeWidth={strokeWidth}
      />

      {/* X */}
      <path
        d="M9 9L15 15"
        stroke={filled ? "#fff" : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M15 9L9 15"
        stroke={filled ? "#fff" : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
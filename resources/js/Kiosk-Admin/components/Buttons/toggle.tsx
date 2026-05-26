interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    activeText?: string;
    inactiveText?: string;
}

export default function Toggle({
    checked,
    onChange,
    disabled = false,
    activeText = "Active",
    inactiveText = "Inactive"
}: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`
                    relative inline-flex items-center
                    w-[85px] h-[32px] rounded-full p-[4px]
                    border-[1.5px] transition-all duration-[280ms] ease-in-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2
                    ${checked
                    ? "bg-[#7F77DD] border-[#7F77DD]"
                    : "bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-600"
                    }
                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
               `}
            >

           {/* Thumb */}
            <span className={`
                relative z-10 flex-shrink-0
                w-[24px] h-[24px] rounded-full bg-white
                transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${checked ? "translate-x-[55px]" : "translate-x-0"}
            `} />

            {/* Label inside track */}
            <span className={`
                absolute inset-0 flex items-center pointer-events-none
                text-[11px] font-medium
                ${checked
                ? "justify-start pl-[12px] text-[#EEEDFE]"
                : "justify-end pr-[12px] text-gray-400 dark:text-zinc-500"
                }
            `}>
                {checked ? activeText : inactiveText}
            </span>
        </button>
    );
}

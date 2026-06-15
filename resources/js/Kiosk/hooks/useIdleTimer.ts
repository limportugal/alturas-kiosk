import { useEffect, useRef, useCallback } from "react";

/**
 * Calls `onIdle` after `timeoutMs` of no user interaction.
 * Pass `undefined` as `timeoutMs` to disable the timer entirely.
 * Resets the timer on mousemove, mousedown, touchstart, or keydown.
 */
export function useIdleTimer(onIdle: () => void, timeoutMs?: number) {
    const timer     = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onIdleRef = useRef(onIdle);

    useEffect(() => { onIdleRef.current = onIdle; }, [onIdle]);

    const reset = useCallback(() => {
        if (timer.current) clearTimeout(timer.current);
        if (timeoutMs == null) return; // disabled
        timer.current = setTimeout(() => onIdleRef.current(), timeoutMs);
    }, [timeoutMs]);

    useEffect(() => {
        if (timeoutMs == null) {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
            return; // disabled — don't attach listeners
        }
        const events = ["mousemove", "mousedown", "touchstart", "keydown"] as const;
        events.forEach((e) => window.addEventListener(e, reset));
        reset();

        return () => {
            events.forEach((e) => window.removeEventListener(e, reset));
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        };
    }, [reset, timeoutMs]);
}

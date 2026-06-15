import { useState, useEffect, useRef } from "react";
import { useCart } from "@/Kiosk/hooks/useCart";
import { useIdleTimer } from "@/Kiosk/hooks/useIdleTimer";
import { colors } from "@/Kiosk/utils/colors";

interface IdleModalProps {
    /** Idle timeout before modal appears — from admin config (ms). Pass undefined to disable. */
    idleTimeoutMs:     number | undefined;
    /** Countdown seconds after modal appears before auto-reset (default: 30) */
    countdownSeconds?: number;
    /** Called after clear cart + reset — navigate to main menu */
    onReset:           () => void;
}

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
    const r    = 28;
    const circ = 2 * Math.PI * r;
    const pct  = seconds / total;
 
    return (
        <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#e0dbd5" strokeWidth="4" />
            <circle
                cx="36" cy="36" r={r}
                fill="none"
                stroke={seconds <= 5 ? "#e53e3e" : colors.primary}
                strokeWidth="4"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
            />
            <text
                x="36" y="36"
                textAnchor="middle" dominantBaseline="central"
                fontSize="18" fontWeight="700"
                fill={seconds <= 5 ? "#e53e3e" : colors.primary}
                style={{ transition: "fill 0.3s ease" }}
            >
                {seconds}
            </text>
        </svg>
    );
}

export function IdleModal({
    idleTimeoutMs,
    countdownSeconds = 30,
    onReset,
}: IdleModalProps) {
    const { clearCart }             = useCart();
    const [open, setOpen]           = useState(false);
    const [visible, setVisible]     = useState(false);
    const [countdown, setCountdown] = useState(countdownSeconds);
    const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);
 
    const stopCountdown = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
 
    // ── Open modal when idle ──────────────────────────────────────────────────
    // useIdleTimer is paused (undefined) while modal is open to avoid re-trigger
    useIdleTimer(() => {
        setCountdown(countdownSeconds);
        setOpen(true);
        requestAnimationFrame(() => setVisible(true));
    }, open ? undefined : idleTimeoutMs);
 
    // ── Countdown while modal is open ─────────────────────────────────────────
    useEffect(() => {
        if (!open) return;
 
        intervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    stopCountdown();
                    handleAutoReset();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
 
        return stopCountdown;
    }, [open]);
 
    // ── Auto reset — clear cart + go to main menu ─────────────────────────────
    const handleAutoReset = async () => {
        stopCountdown();
        await clearCart();
        setVisible(false);
        setTimeout(() => {
            setOpen(false);
            onReset();
        }, 280);
    };
 
    // ── Customer still here ───────────────────────────────────────────────────
    const handleStillHere = () => {
        stopCountdown();
        setVisible(false);
        setTimeout(() => setOpen(false), 280);
    };
 
    if (!open) return null;
 
    return (
        <div
            style={{
                position:       "fixed",
                inset:          0,
                zIndex:         1300,
                background:     "rgba(0,0,0,0.65)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                opacity:        visible ? 1 : 0,
                transition:     "opacity 0.28s ease",
            }}
        >
            <div
                style={{
                    background:   "#fff",
                    borderRadius: 24,
                    width:        440,
                    maxWidth:     "88vw",
                    overflow:     "hidden",
                    textAlign:    "center",
                    transform:    visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                    transition:   "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease",
                    opacity:      visible ? 1 : 0,
                    boxShadow:    "0 24px 64px rgba(0,0,0,0.22)",
                }}
            >
                {/* Header */}
                <div style={{ background: colors.primary, padding: "20px 32px" }}>
                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: 0 }}>
                        SESSION TIMEOUT
                    </p>
                </div>
 
                {/* Body */}
                <div style={{ padding: "32px 32px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                        <CountdownRing seconds={countdown} total={countdownSeconds} />
                    </div>
 
                    <p style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px", lineHeight: 1.3 }}>
                        Are you still there?
                    </p>
                    <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px", lineHeight: 1.6 }}>
                        Your session will reset and your cart will be cleared in{" "}
                        <span style={{ fontWeight: 700, color: countdown <= 5 ? "#e53e3e" : colors.primary }}>
                            {countdown} second{countdown !== 1 ? "s" : ""}
                        </span>{" "}
                        due to inactivity.
                    </p>
 
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={handleAutoReset}
                            style={{
                                flex: 1, padding: "14px 0", borderRadius: 12,
                                border: "2px solid #e0dbd5", background: "#fff",
                                color: "#888", fontSize: 14, fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            Reset session
                        </button>
                        <button
                            onClick={handleStillHere}
                            style={{
                                flex: 2, padding: "14px 0", borderRadius: 12,
                                border: "none", background: colors.primary,
                                color: "#fff", fontSize: 15, fontWeight: 700,
                                cursor: "pointer", letterSpacing: 0.5,
                            }}
                        >
                            Yes, I'm still here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
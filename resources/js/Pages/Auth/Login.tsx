import { Head, useForm } from '@inertiajs/react';
import { Icon, icons } from '@/Kiosk-Admin/utils/icon';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Log in" />
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1028 0%, #3d1d66 50%, #5a2d82 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>

                {/* Decorative circles */}
                {[
                    { w: 400, h: 400, top: -120, right: -80, op: 0.06 },
                    { w: 300, h: 300, bottom: -60, left: -60, op: 0.08 },
                    { w: 200, h: 200, top: "40%", left: "10%", op: 0.04 },
                ].map((c, i) => (
                    <div key={i} style={{ position: "absolute", width: c.w, height: c.h, top: c.top as any, bottom: c.bottom as any, left: c.left as any, right: c.right as any, borderRadius: "50%", background: "#fff", opacity: c.op, pointerEvents: "none" }} />
                ))}

                <div style={{ width: "100%", maxWidth: 440 }}>
                    <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", padding: "40px 40px 36px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>

                        {/* Logo */}
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                                <span style={{ fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: -3, fontFamily: "'DM Serif Display', serif" }}>H</span>
                                <span style={{ fontSize: 46, fontWeight: 400, color: "#e8b86d", fontStyle: "italic", fontFamily: "'DM Serif Display', serif" }}>&</span>
                                <span style={{ fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: -3, fontFamily: "'DM Serif Display', serif" }}>F</span>
                            </div>
                            <div style={{ fontSize: 11, letterSpacing: 6, color: "rgba(255,255,255,0.6)", marginTop: -4, fontWeight: 500 }}>DEPARTMENT STORE</div>
                            <div style={{ marginTop: 20, fontSize: 15, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Admin Panel</div>
                        </div>

                        <form onSubmit={submit}>
                            {/* Status */}
                            {status && (
                                <div style={{ background: "rgba(39,174,96,0.15)", border: "1px solid rgba(39,174,96,0.4)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                                    <span style={{ fontSize: 13, color: "#6dffaa" }}>{status}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: 0.3 }}>Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="Enter email"
                                    autoComplete="username"
                                    style={{ width: "100%", padding: "10px 14px", border: errors.email ? "1.5px solid rgba(232,51,60,0.6)" : "1.5px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#fff", background: "rgba(255,255,255,0.08)", outline: "none", boxSizing: "border-box" }}
                                />
                                {errors.email && <p style={{ fontSize: 12, color: "#ff9999", marginTop: 4 }}>{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 0.3 }}>Password</label>
                                    {canResetPassword && (
                                        <a href={route('password.request')} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                                            Forgot password?
                                        </a>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    style={{ width: "100%", padding: "10px 14px", border: errors.password ? "1.5px solid rgba(232,51,60,0.6)" : "1.5px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#fff", background: "rgba(255,255,255,0.08)", outline: "none", boxSizing: "border-box" }}
                                />
                                {errors.password && <p style={{ fontSize: 12, color: "#ff9999", marginTop: 4 }}>{errors.password}</p>}
                            </div>

                            {/* Error */}
                            {(errors.email || errors.password) && (
                                <div style={{ background: "rgba(232,51,60,0.15)", border: "1px solid rgba(232,51,60,0.4)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                    <Icon d={icons.warning} size={14} color="#ff6b6b" />
                                    <span style={{ fontSize: 13, color: "#ff9999" }}>Invalid credentials.</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "13px", fontSize: 14, fontWeight: 600, letterSpacing: 1, background: processing ? "#7a4da8" : "#5a2d82", color: "#fff", border: "none", borderRadius: 8, cursor: processing ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(90,45,130,0.5)", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}
                            >
                                {processing
                                    ? <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                    : "SIGN IN"
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

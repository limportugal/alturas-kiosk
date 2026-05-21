import React, { useEffect, useState } from 'react';

type SessionGuardProps = {
    App: any;
    props: any;
};

export default function SessionGuard({ App, props}: SessionGuardProps) {
    const [showSessionModal , setShowSessionModal] = useState(false);

    useEffect(() => {
        const onSessionExpired = () => {
            setShowSessionModal(true);
        };

        window.addEventListener('session-expired', onSessionExpired as EventListener);

        return () => {
            window.removeEventListener('session-expired', onSessionExpired as EventListener);
        };

    }, []);

    const goToLogin = () => {
        window.location.href = typeof route === 'function' ? route('login') : '/login';
    };

    return (
        <>
            <App {...props} />

            {showSessionModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                    }}
                >
                    <div
                        style={{
                            width: 'min(420px, 92vw)',
                            background: '#fff',
                            borderRadius: '14px',
                            padding: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                            Session Expired
                        </h2>

                        <p style={{ marginTop: '10px', color: '#4b5563', lineHeight: 1.5 }}>
                            Your session has ended. Please log in again to continue.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
                            <button
                                onClick={goToLogin}
                                style={{
                                    background: '#2563eb',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}
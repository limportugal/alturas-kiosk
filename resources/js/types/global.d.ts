import type { PageProps as InertiaPageProps } from '@inertiajs/core';

declare global {
    interface User {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        role?: string | null;
        permission?: string[];
    }

    interface SharedPageProps extends InertiaPageProps {
        auth: {
            user: User | null;
        };
        [key: string]: unknown;
    }

    function route(...args: any[]): any;
}

export {};

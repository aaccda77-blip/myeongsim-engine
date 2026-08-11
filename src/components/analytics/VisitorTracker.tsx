'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
    useEffect(() => {
        try {
            const referrer = typeof document !== 'undefined' ? document.referrer : '';
            const search = typeof window !== 'undefined' ? window.location.search : '';
            const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

            let userData: any = {};
            if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem('myeongsim_user');
                if (storedUser) {
                    try {
                        userData = JSON.parse(storedUser);
                    } catch {}
                }
            }

            fetch('/api/analytics/log-visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referrer,
                    search,
                    pathname,
                    user_id: userData.id || userData.user_id || '',
                    email: userData.email || '',
                    name: userData.name || userData.user_name || '',
                    gender: userData.gender || '미설정',
                    birth_date: userData.birth_date || userData.birthDate || '',
                }),
            }).catch(() => {});
        } catch (e) {}
    }, []);

    return null;
}

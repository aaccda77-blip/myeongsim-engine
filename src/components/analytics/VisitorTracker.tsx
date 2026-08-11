'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
    useEffect(() => {
        try {
            const referrer = typeof document !== 'undefined' ? document.referrer : '';
            const search = typeof window !== 'undefined' ? window.location.search : '';
            const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

            fetch('/api/analytics/log-visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referrer, search, pathname }),
            }).catch(() => {});
        } catch (e) {}
    }, []);

    return null;
}

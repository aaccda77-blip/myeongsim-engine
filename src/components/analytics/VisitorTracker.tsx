'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
    useEffect(() => {
        try {
            fetch('/api/analytics/log-visitor', { method: 'POST' }).catch(() => {});
        } catch (e) {}
    }, []);

    return null;
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PushAnalyticsResponse } from '@/types/analytics';

interface UsePushAnalyticsOptions {
    days?: number;
    enabled?: boolean;
}

export function usePushAnalytics({ days = 14, enabled = true }: UsePushAnalyticsOptions = {}) {
    const [data, setData] = useState<PushAnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [dataUpdatedAt, setDataUpdatedAt] = useState<number>(Date.now());

    const fetchData = useCallback(async () => {
        if (!enabled) return;
        setIsFetching(true);
        try {
            const res = await fetch(`/api/analytics/push-comparison?days=${days}`);
            if (!res.ok) throw new Error(`Failed to fetch push analytics: ${res.statusText}`);
            const json = await res.json();
            if (json.success && json.data) {
                setData(json.data);
                setDataUpdatedAt(Date.now());
                setIsError(false);
                setError(null);
            }
        } catch (err: any) {
            setIsError(true);
            setError(err);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [days, enabled]);

    // Initial Fetch & 60s Polling Loop
    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 60 * 1000); // ⏱️ 1분(60초) 주기 자동 갱신

        return () => clearInterval(interval);
    }, [fetchData]);

    return {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        dataUpdatedAt,
        refetch: fetchData
    };
}

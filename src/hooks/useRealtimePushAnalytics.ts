'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { PushAnalyticsResponse } from '@/types/analytics';

interface UseRealtimePushAnalyticsOptions {
    days?: number;
    enabled?: boolean;
}

export function useRealtimePushAnalytics({
    days = 14,
    enabled = true
}: UseRealtimePushAnalyticsOptions = {}) {
    const [data, setData] = useState<PushAnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [dataUpdatedAt, setDataUpdatedAt] = useState<number>(Date.now());

    // Realtime Connection States
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [lastLiveEventAt, setLastLiveEventAt] = useState<Date | null>(null);
    const [isLivePulsing, setIsLivePulsing] = useState<boolean>(false);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Fetcher Function
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

    // 2. 1.5초 디바운스된 실시간 무효화 트리거 (Debounced Invalidation)
    const triggerDebouncedRefetch = useCallback(() => {
        setLastLiveEventAt(new Date());
        setIsLivePulsing(true);
        setTimeout(() => setIsLivePulsing(false), 2000);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchData();
        }, 1500); // 1.5초 동안 유입된 대량 클릭을 1회의 재조회로 병합
    }, [fetchData]);

    // 3. Initial Fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 4. Supabase Realtime WebSocket 채널 구독
    useEffect(() => {
        if (!enabled || !supabase) return;

        let channel: any = null;
        try {
            channel = supabase
                .channel(`realtime-push-analytics-${days}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'push_delivery_logs'
                    },
                    () => {
                        triggerDebouncedRefetch();
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'user_app_sessions'
                    },
                    () => {
                        triggerDebouncedRefetch();
                    }
                )
                .subscribe((status: string) => {
                    if (status === 'SUBSCRIBED') {
                        setIsConnected(true);
                    } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                        setIsConnected(false);
                    }
                });
        } catch (e) {
            console.warn('Realtime subscription fallback:', e);
            setIsConnected(false);
        }

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            if (channel && supabase) {
                try {
                    supabase.removeChannel(channel);
                } catch (e) {}
            }
        };
    }, [days, enabled, triggerDebouncedRefetch]);

    return {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        dataUpdatedAt,
        isConnected,
        lastLiveEventAt,
        isLivePulsing,
        refetch: fetchData
    };
}

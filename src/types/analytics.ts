export interface DailyPushMetric {
    date: string;
    groupA_sent: number;
    groupA_opened: number;
    groupA_openRate: number;
    groupA_dwellMin: number;
    groupB_sent: number;
    groupB_opened: number;
    groupB_openRate: number;
    groupB_dwellMin: number;
}

export interface PushAnalyticsSummary {
    groupA_avgOpenRate: number;
    groupB_avgOpenRate: number;
    groupA_avgDwellSec: number;
    groupB_avgDwellSec: number;
    groupA_cvr: number;
    groupB_cvr: number;
}

export interface PushAnalyticsResponse {
    daily: DailyPushMetric[];
    summary: PushAnalyticsSummary;
}

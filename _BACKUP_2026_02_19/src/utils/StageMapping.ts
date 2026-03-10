/**
 * StageMapping.ts
 * Maps the 7 Coaching Stages (Growth Map) to the specific Page Steps in the Report.
 * This ensures that selecting a stage in the menu navigates the user to the correct content.
 */

export const STAGE_TO_REPORT_STEP: Record<number, number> = {
    1: 3,  // 발견 (Discovery) -> SajuPaljaView (사주 팔자 원국)
    2: 5,  // 융합 (Fusion) -> RadarChartView (재능 레이더)
    3: 7,  // 치유 (Healing) -> FlipCardView (심리 치유 카드)
    4: 12, // 행동 (Action) -> ActionItemsView (실천 과제)
    5: 10, // 유지 (Maintenance) -> LifeWaveView (운세 흐름)
    6: 9,  // 확장 (Expansion) -> WealthGaugeView (재물 운용)
    7: 13  // 초월 (Transcendence) -> EpilogueView (에필로그)
};

/**
 * Helper to get the target step for a given stage.
 * Defaults to Step 1 (Cover) if not found.
 */
export const getTargetStepForStage = (stageId: number): number => {
    return STAGE_TO_REPORT_STEP[stageId] || 1;
};

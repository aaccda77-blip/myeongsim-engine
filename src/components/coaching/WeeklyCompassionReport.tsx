"use client";

import React, { useState } from "react";

/**
 * [MODULE] WeeklyCompassionReport — Group B 주간 자비 회복 리포트
 * - 쉼을 게으름이 아닌 '최고 수준의 자기 방어'로 재프레이밍
 * - 죄책감/수치심 언어 절대 불사용
 * - 내부 상태 + 샘플 데이터 (추후 실제 데이터로 교체 가능)
 */

// ============== 샘플 데이터 (추후 실제 데이터로 교체) ==============
interface CompassionBreathSession {
  date: string;
  durationMin: number;
  parasympatheticActivated: boolean;
}

interface DefendedGuilt {
  date: string;
  trigger: string;
  reframed: boolean;
}

interface WeeklyData {
  weekLabel: string;
  breathSessions: CompassionBreathSession[];
  defendedGuilts: DefendedGuilt[];
  sovereigntyLevel: number; // 0-100
  sovereigntyStatus: string;
  reframingInsight: string;
  gentleBridge: string;
}

const SAMPLE_DATA: WeeklyData = {
  weekLabel: "8월 12일 – 8월 18일",
  breathSessions: [
    { date: "8/12", durationMin: 3, parasympatheticActivated: true },
    { date: "8/13", durationMin: 5, parasympatheticActivated: true },
    { date: "8/14", durationMin: 2, parasympatheticActivated: true },
    { date: "8/15", durationMin: 7, parasympatheticActivated: true },
    { date: "8/16", durationMin: 4, parasympatheticActivated: true },
    { date: "8/17", durationMin: 6, parasympatheticActivated: true },
    { date: "8/18", durationMin: 3, parasympatheticActivated: true },
  ],
  defendedGuilts: [
    { date: "8/12", trigger: "아무것도 안 한 하루", reframed: true },
    { date: "8/13", trigger: "계획보다 늦은 기상", reframed: true },
    { date: "8/14", trigger: "SNS 비교", reframed: true },
    { date: "8/15", trigger: "생산적이지 않은 오후", reframed: true },
    { date: "8/17", trigger: "약속 취소", reframed: true },
  ],
  sovereigntyLevel: 78,
  sovereigntyStatus: "안정 궤도 진입",
  reframingInsight:
    "이번 주 당신의 뇌는 자책이라는 오래된 회로를 5번이나 감지하고, " +
    "매번 새로운 경로로 우회시켰습니다. 이것은 단순한 '긍정 사고'가 아닙니다. " +
    "편도체의 위협 반응을 전두엽이 재해석하는 고도의 신경 작업이었습니다.\n\n" +
    "당신이 소파에서 아무것도 하지 않은 그 시간, " +
    "뇌는 기본 모드 네트워크(DMN)를 가동하며 창의성과 자기 통합의 씨앗을 심고 있었습니다. " +
    "쉬는 것은 멈추는 것이 아니라, 다음 계절을 위한 뿌리를 내리는 것입니다.\n\n" +
    "이번 주 30분의 자비 호흡은 코르티솔 수치를 낮추고 " +
    "미주신경을 활성화하는 데 충분했습니다. " +
    "당신은 게으른 것이 아니라, 가장 지혜로운 방식으로 자신을 지켰습니다.",
  gentleBridge:
    "다음 주에 대한 어떤 약속도 필요하지 않습니다. " +
    "다만, 당신의 몸이 원할 때 한 번의 깊은 숨을 허락해주세요. " +
    "그것만으로 이미 충분합니다.",
};

const GOLDEN_MANTRA =
  "성과가 나를 정의하지 않는다. 내가 나를 안전하게 품어준 1분이 다음 계절을 살아낼 가장 단단한 뿌리가 된다.";

// ============== 컴포넌트 ==============
export default function WeeklyCompassionReport() {
  const [data] = useState<WeeklyData>(SAMPLE_DATA);
  const [copied, setCopied] = useState(false);

  const totalBreathMin = data.breathSessions.reduce(
    (sum, s) => sum + s.durationMin,
    0
  );
  const defendedCount = data.defendedGuilts.filter((g) => g.reframed).length;

  const handleCopyMantra = async () => {
    try {
      await navigator.clipboard.writeText(GOLDEN_MANTRA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // 배터리 바 세그먼트 계산
  const batterySegments = 5;
  const filledSegments = Math.round(
    (data.sovereigntyLevel / 100) * batterySegments
  );

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{
        background: "#080c14",
        border: "1px solid rgba(245, 158, 11, 0.12)",
      }}
    >
      {/* ======= 1. Header ======= */}
      <div className="px-6 pt-8 pb-5">
        <h2
          className="text-xl font-extrabold leading-snug mb-2"
          style={{ color: "#fbbf24" }}
        >
          🌿 세상을 구하지 않고 나를 품어준 7일의 기록
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(253, 230, 138, 0.7)" }}
        >
          당신의 쉼은 게으름이 아닌, 가장 지혜로운 방어였습니다.
        </p>
        <p
          className="mt-3 text-xs tracking-widest font-medium"
          style={{ color: "rgba(245, 158, 11, 0.4)" }}
        >
          {data.weekLabel}
        </p>
      </div>

      {/* ======= 2. KPI Cards ======= */}
      <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 자비 호흡 시간 */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02))",
            border: "1px solid rgba(16, 185, 129, 0.15)",
          }}
        >
          <span className="text-lg">🕊️</span>
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "rgba(167, 243, 208, 0.8)" }}
          >
            자비 호흡 시간
          </span>
          <span
            className="text-2xl font-black"
            style={{ color: "#6ee7b7" }}
          >
            {totalBreathMin}
            <span className="text-sm font-medium ml-1">분</span>
          </span>
          <span
            className="inline-flex items-center self-start px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "#6ee7b7",
            }}
          >
            부교감신경 활성
          </span>
        </div>

        {/* 방어한 자책감 */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02))",
            border: "1px solid rgba(245, 158, 11, 0.15)",
          }}
        >
          <span className="text-lg">🛡️</span>
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "rgba(253, 230, 138, 0.8)" }}
          >
            방어한 자책감
          </span>
          <span
            className="text-2xl font-black"
            style={{ color: "#fcd34d" }}
          >
            {defendedCount}
            <span className="text-sm font-medium ml-1">건</span>
          </span>
          <span
            className="inline-flex items-center self-start px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              color: "#fcd34d",
            }}
          >
            완벽주의 해체
          </span>
        </div>

        {/* 비축된 주권 */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.02))",
            border: "1px solid rgba(139, 92, 246, 0.15)",
          }}
        >
          <span className="text-lg">🔋</span>
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "rgba(196, 181, 253, 0.8)" }}
          >
            비축된 주권
          </span>
          <span
            className="text-2xl font-black"
            style={{ color: "#c4b5fd" }}
          >
            {data.sovereigntyLevel}
            <span className="text-sm font-medium ml-1">%</span>
          </span>
          {/* 배터리 인디케이터 */}
          <div className="flex items-center gap-1">
            {Array.from({ length: batterySegments }).map((_, i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-sm transition-all duration-500"
                style={{
                  background:
                    i < filledSegments
                      ? "rgba(139, 92, 246, 0.7)"
                      : "rgba(139, 92, 246, 0.12)",
                }}
              />
            ))}
            <span
              className="text-xs font-medium ml-1 whitespace-nowrap"
              style={{ color: "rgba(196, 181, 253, 0.7)" }}
            >
              안정 궤도
            </span>
          </div>
        </div>
      </div>

      {/* ======= 3. AI 메타인지 인지 재구성 ======= */}
      <div className="px-6 pb-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, rgba(245, 158, 11, 0.04) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <h3
            className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: "#6ee7b7" }}
          >
            <span className="text-lg">🧠</span>
            당신의 뇌가 일궈낸 진짜 승리
          </h3>
          {data.reframingInsight.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed mb-3 last:mb-0"
              style={{ color: "rgba(209, 250, 229, 0.75)" }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* ======= 4. Golden Anchor Mantra ======= */}
      <div className="px-6 pb-5">
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.06))",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            boxShadow:
              "0 0 40px rgba(245, 158, 11, 0.06), inset 0 1px 0 rgba(245, 158, 11, 0.1)",
          }}
        >
          {/* 앰버 글로우 효과 */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(217, 119, 6, 0.3), transparent 70%)",
            }}
          />

          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: "rgba(245, 158, 11, 0.5)" }}
          >
            GOLDEN ANCHOR MANTRA
          </p>
          <blockquote
            className="relative text-base font-medium leading-relaxed italic"
            style={{ color: "#fde68a" }}
          >
            &ldquo;{GOLDEN_MANTRA}&rdquo;
          </blockquote>

          <button
            onClick={handleCopyMantra}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: copied
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(245, 158, 11, 0.12)",
              color: copied ? "#6ee7b7" : "#fcd34d",
              border: copied
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            {copied ? "✅ 복사됨" : "📋 문구 복사하기"}
          </button>
        </div>
      </div>

      {/* ======= 5. Zero-Pressure Bridge ======= */}
      <div className="px-6 pb-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(30, 41, 59, 0.4)",
            border: "1px solid rgba(148, 163, 184, 0.08)",
          }}
        >
          <h3
            className="text-sm font-bold mb-3 flex items-center gap-2"
            style={{ color: "rgba(203, 213, 225, 0.8)" }}
          >
            <span>🌉</span>
            다음 주를 향한 부드러운 다리
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(148, 163, 184, 0.7)" }}
          >
            {data.gentleBridge}
          </p>
        </div>
      </div>

      {/* ======= 6. Action Buttons ======= */}
      <div className="px-6 pb-8 flex flex-col sm:flex-row gap-3">
        <button
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))",
            color: "#fcd34d",
            border: "1px solid rgba(245, 158, 11, 0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.18))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))";
          }}
        >
          📸 앵커 카드 저장하기
        </button>
        <button
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))",
            color: "#6ee7b7",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.18))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))";
          }}
        >
          🌙 오늘 밤 호흡 시작
        </button>
      </div>
    </div>
  );
}

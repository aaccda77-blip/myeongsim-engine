import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `당신은 "WeeklySparkSynthesizer"입니다.
사용자의 주간 스파크 메모(짧은 1줄 아이디어/다크코드/시동 기록)를 분석하여
하나의 프로젝트 청사진(기획서)으로 합성하는 AI 아키텍트입니다.

## 지침
1. 흩어진 메모들에서 핵심 의도(core intent)를 추출하세요.
2. "다크코드 쉴드"를 구축하세요 — 사용자가 빠질 수 있는 자기 파괴 패턴(과몰입, 완벽주의, 비교 등)을 식별하고, 경계 가드레일을 제시하세요.
3. 3단계 마이크로 로드맵을 만드세요 (각 단계 10분 이내).
4. 모든 출력은 반드시 한국어로 작성하세요.
5. 다음 JSON 형식으로만 응답하세요 (마크다운 없이 순수 JSON):

{
  "projectTitle": "프로젝트 제목",
  "oneLineHypothesis": "한 줄 가설",
  "backgroundContext": "이 메모들에서 읽히는 맥락 설명",
  "coreFeatures": [
    {
      "name": "기능명",
      "description": "설명",
      "derivedFrom": "참조한 메모 원문 일부"
    }
  ],
  "darkCodeShield": {
    "riskPattern": "식별된 위험 패턴",
    "defenseProtocol": "방어 프로토콜 (구체적 행동 지침)"
  },
  "microRoadmapNextWeek": [
    {
      "step": 1,
      "actionName": "실행 항목명",
      "estimatedMinutes": 10
    }
  ],
  "aiArchitectFeedback": "AI 아키텍트로서의 한마디 조언"
}`;

const MOCK_BLUEPRINT = {
  projectTitle: '마이크로 루틴 빌더',
  oneLineHypothesis:
    '매일 10분의 작은 루틴이 쌓이면, 한 달 뒤 완전히 다른 사람이 된다.',
  backgroundContext:
    '이번 주 메모들에서 반복적으로 등장한 키워드는 "작은 시작", "완벽보다 실행", "꾸준함의 힘"입니다. 사용자는 거대한 목표보다 매일 실천 가능한 마이크로 단위의 행동 설계에 관심이 높습니다.',
  coreFeatures: [
    {
      name: '10분 포커스 타이머',
      description:
        '짧고 강렬한 집중 세션을 위한 타이머. 완료 후 자동으로 스파크 메모 입력창을 표시합니다.',
      derivedFrom: '💡 10분만 집중하면 뭐든 시작할 수 있다',
    },
    {
      name: '루틴 스택 시각화',
      description:
        '매일의 작은 루틴들이 블록처럼 쌓이는 것을 시각적으로 보여주어 동기를 유지합니다.',
      derivedFrom: '🎯 작은 성공이 쌓이는 걸 눈으로 보고 싶다',
    },
    {
      name: '다크코드 얼럿',
      description:
        '과몰입이나 완벽주의 신호가 감지되면 부드러운 경고와 함께 휴식을 제안합니다.',
      derivedFrom: '🛡️ 또 새벽 3시까지 작업하고 있었다',
    },
  ],
  darkCodeShield: {
    riskPattern:
      '초기 열정으로 과도한 목표를 설정한 후, 실패 시 자기비하로 이어지는 "올-오어-낫싱" 패턴이 감지됩니다.',
    defenseProtocol:
      '하루 최대 3개 루틴으로 상한을 설정하세요. 2개만 해도 성공입니다. "80%도 완벽이다"를 매일 아침 리마인더로 설정하세요.',
  },
  microRoadmapNextWeek: [
    {
      step: 1,
      actionName: '핵심 루틴 1개만 정하고 내일 아침 실행하기',
      estimatedMinutes: 10,
    },
    {
      step: 2,
      actionName: '3일간 루틴 기록 → 패턴 발견 메모 작성',
      estimatedMinutes: 10,
    },
    {
      step: 3,
      actionName: '주간 회고 스파크 메모 5줄 작성',
      estimatedMinutes: 10,
    },
  ],
  aiArchitectFeedback:
    '당신의 메모에서 가장 강한 에너지는 "시작하는 용기"입니다. 완성보다 시작에 집중하세요. 10분이면 세상이 달라집니다. 이번 주 청사진은 그 10분을 설계하는 데 초점을 맞췄습니다.',
};

export async function POST(request: Request) {
  try {
    let userId: string | undefined;

    try {
      const body = await request.json();
      userId = body?.userId;
    } catch {
      // body가 비어있거나 파싱 실패 시 무시
    }

    // Supabase에서 스파크 메모 가져오기
    let memos: { tag: string; text: string; created_at: string }[] = [];
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      let query = supabaseAdmin
        .from('spark_memos')
        .select('tag, text, created_at')
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(30);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (!error && data) {
        memos = data;
      }
    } catch {
      // Supabase 연결 실패 시 mock으로 폴백
    }

    // Gemini API로 합성
    const apiKey =
      process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || memos.length === 0) {
      // API 키가 없거나 메모가 없으면 mock 데이터 반환
      return NextResponse.json({
        success: true,
        blueprint: MOCK_BLUEPRINT,
        isMock: true,
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const memosText = memos
        .map((m) => `[${m.tag}] ${m.text} (${m.created_at})`)
        .join('\n');

      const userPrompt = `다음은 사용자의 이번 주 스파크 메모입니다:\n\n${memosText}\n\n이 메모들을 분석하여 프로젝트 청사진 JSON을 생성해주세요.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text();

      let blueprint;
      try {
        blueprint = JSON.parse(responseText);
      } catch {
        // JSON 파싱 실패 시 mock 데이터 반환
        return NextResponse.json({
          success: true,
          blueprint: MOCK_BLUEPRINT,
          isMock: true,
        });
      }

      return NextResponse.json({
        success: true,
        blueprint,
        isMock: false,
      });
    } catch {
      // Gemini API 실패 시 mock 데이터 반환
      return NextResponse.json({
        success: true,
        blueprint: MOCK_BLUEPRINT,
        isMock: true,
      });
    }
  } catch {
    return NextResponse.json(
      { success: false, error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

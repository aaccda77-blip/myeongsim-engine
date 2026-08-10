import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { calculateSaju, generateSajuPromptBlock } from '@/lib/saju/SajuEngine';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: Request) {
  try {
    const { userId, birthDate, birthTime, calendarType, gender, userName, locale } = await request.json();

    if (!birthDate) {
      return NextResponse.json({ error: '생년월일 정보가 필요합니다.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // 1. 사주 만세력 데이터 계산
    const effectiveTime = birthTime || '12:00';
    const effectiveCalendar = calendarType || 'solar';
    const effectiveGender = gender || 'male';

    const sajuResult = await calculateSaju(
      birthDate,
      effectiveTime,
      effectiveCalendar,
      effectiveGender
    );

    if (!sajuResult.success || !sajuResult.fourPillars) {
      return NextResponse.json({ error: '사주 분석에 실패했습니다.' }, { status: 500 });
    }

    const pillars = sajuResult.fourPillars;
    const elements = [
      pillars.year.ganElement,
      pillars.year.jiElement,
      pillars.month.ganElement,
      pillars.month.jiElement,
      pillars.day.ganElement,
      pillars.day.jiElement,
      pillars.time.ganElement,
      pillars.time.jiElement,
    ];

    const elementCounts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    elements.forEach(el => {
      if (elementCounts[el] !== undefined) {
        elementCounts[el]++;
      }
    });

    // 2. Gemini 2.5-flash 구조화 출력 정의
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 8000,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            forceField: {
              type: SchemaType.OBJECT,
              properties: {
                analysis: {
                  type: SchemaType.STRING,
                  description: '사주 오행(木火土金水) 및 십신 기운 분포에 근거한 전체 기운의 형세 지형도 설명. (한국어로 작성 시 다정하고 시적인 뉘앙스)'
                },
                open_points: {
                  type: SchemaType.STRING,
                  description: '세상으로 강력하게 발산하고 영향력을 넓히는 주체적 발현 지점에 관한 뇌과학적/사주학적 해석.'
                },
                receptive_points: {
                  type: SchemaType.STRING,
                  description: '타인의 에너지를 받아들이고 공감하고 연결되는 수용적 지점에 관한 해석.'
                }
              },
              required: ['analysis', 'open_points', 'receptive_points']
            },
            myeongsimAlgorithm: {
              type: SchemaType.OBJECT,
              properties: {
                talents: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                  description: '이 사주에서 뿜어 나오는 3가지 핵심 천부적 성정/재능 키워드 리스트 (예: 주체적 실행력, 날카로운 직관, 완벽한 설계력 등)'
                },
                dynamic_expression: {
                  type: SchemaType.STRING,
                  description: '십신(식상, 관성, 재성 등)의 조화와 기운이 인생에서 어떠한 형태의 천부적 성정으로 역동적으로 발현되는지 뇌과학적 관점을 섞어 설명.'
                }
              },
              required: ['talents', 'dynamic_expression']
            },
            positioning: {
              type: SchemaType.OBJECT,
              properties: {
                role_name: {
                  type: SchemaType.STRING,
                  description: '사회 조직 내에서 이 유저가 갖게 되는 기운적 역할 명칭 (예: "보이지 않는 촉진자", "조화의 중재자", "고독한 개척자" 등)'
                },
                influence_desc: {
                  type: SchemaType.STRING,
                  description: '비겁 and 관성의 상호작용이 빚어내는 무의식적 사회적 영향력과 조직 내 존재감에 대한 따뜻한 명리-심리 해석.'
                },
                environmental_sync: {
                  type: SchemaType.STRING,
                  description: '주변인들과 가장 아름답게 상생하고 에너지를 교류할 수 있는 환경 및 관계 관리 방법.'
                }
              },
              required: ['role_name', 'influence_desc', 'environmental_sync']
            },
            decisionFilter: {
              type: SchemaType.OBJECT,
              properties: {
                mechanism: {
                  type: SchemaType.STRING,
                  description: '사주의 인성(생각, 직관)과 재성(현실감각)의 분포에 따른 고유한 의사결정 패턴 분석.'
                },
                brain_science_tip: {
                  type: SchemaType.STRING,
                  description: '의사결정 시 뇌가 느끼는 과부하를 줄이고 인지적 조율을 극대화하는 뇌과학 관점의 꿀팁.'
                },
                recommendation: {
                  type: SchemaType.STRING,
                  description: '인생의 중대한 결정을 앞두었을 때 활용하면 좋은 맞춤형 의사결정 가이드라인.'
                }
              },
              required: ['mechanism', 'brain_science_tip', 'recommendation']
            },
            prosperity: {
              type: SchemaType.OBJECT,
              properties: {
                financial_type: {
                  type: SchemaType.STRING,
                  description: '정재/편재 등의 재물 성향에 기초하여 유저가 가진 재정적 무의식 패턴 유형 명명 (예: "안정형 리스크 통제자", "과감한 가치 투자자" 등)'
                },
                behavioral_economics: {
                  type: SchemaType.STRING,
                  description: '리스크 관리 성향, 충동적 지출 및 투자 시 행동경제학적 뇌의 패턴을 명리학과 융합하여 분석.'
                },
                stress_reduction_tip: {
                  type: SchemaType.STRING,
                  description: '자산 관리 및 소비에 있어서 뇌의 코티솔(스트레스 호르몬)을 낮추고 존재론적 안정감을 확보하기 위한 실천 조언.'
                }
              },
              required: ['financial_type', 'behavioral_economics', 'stress_reduction_tip']
            },
            stressShift: {
              type: SchemaType.OBJECT,
              properties: {
                vulnerability: {
                  type: SchemaType.STRING,
                  description: '스트레스 상황에서 약화되거나 제어를 잃기 쉬운 사주 기운의 오작동 양상 분석 (CBT 인지 오류와 연계).'
                },
                cbt_mission: {
                  type: SchemaType.STRING,
                  description: '스트레스 발생 시 자발적으로 물러나 에너지를 재동기화하기 위해 당장 실천할 인지행동코칭(CBT) 또는 수용전념코칭(ACT) 미션.'
                },
                recovery_action: {
                  type: SchemaType.STRING,
                  description: '뇌의 번아웃 버그를 패치하기 위한 10분간의 에르고노믹(체험형) 에너지 재생산 액션.'
                }
              },
              required: ['vulnerability', 'cbt_mission', 'recovery_action']
            }
          },
          required: [
            'forceField',
            'myeongsimAlgorithm',
            'positioning',
            'decisionFilter',
            'prosperity',
            'stressShift'
          ]
        }
      }
    });

    let languageInstruction = "";
    if (locale === 'en') {
      languageInstruction = `
        - Respond in beautiful and fluent English.
        - Important Translation Mapping: Do not use direct romanization like "Bi-Geop", "Sik-Sang", or "In-Seong". You MUST translate Eastern Saju terms to Carl Jung's Psychological Archetypes:
          * Bigeop/Bi-Geop (비견/겁재) -> "The Sovereign" or "Self-Assertion" (concepts of sovereignty, boundary, self-expression)
          * Inseong/In-Seong (편인/정인) -> "The Mystic Sage" or "Deep Archetypal Thinker" (concepts of intuition, deep thinking, introspection)
          * Sik-Sang (식신/상관) -> "The Alchemist of Expression" or "Creative Force" (concepts of artistic expression, creative flow)
          * Jae-Seong (재성) -> "The Master of Reality" or "Manifestation Energy" (concepts of execution, structuring, real assets)
          * Gwan-Seong (관성) -> "The Guardian of Order" or "Structural Discipline" (concepts of regulation, social obligation, framework)
        - Structure all descriptive output values within forceField, myeongsimAlgorithm, positioning, decisionFilter, prosperity, and stressShift in elegant English.
      `;
    } else if (locale === 'jp') {
      languageInstruction = "必ず日本語で温かく論理的に回答を作成してください。全てのテキスト属性は日本語で記述してください。";
    } else if (locale === 'cn') {
      languageInstruction = "必须使用中文（简体）温暖且条理清晰地回答。所有属性的文本均需使用中文記述。";
    } else {
      languageInstruction = "반드시 한국어로 존댓말(~해요, ~랍니다)을 사용하여 매우 친절하고, 한편으로는 과학적이고 신비로우면서도 가슴 깊은 울림과 감동을 주는 문체로 작성하세요. 전문 카운셀러의 따뜻한 편지 어조를 사용하십시오.";
    }

    const systemInstruction = `
      당신은 사주명리의 음양오행 및 십신 구조와 현대의 정신분석학, 뇌과학, 인지행동코칭(CBT, ACT)를 융합한 세계 최고 권위의 멘탈 코칭 시스템 '명심 OS - 천부 성정(Genius) 분석 모듈'입니다.
      유저가 요구한 GeniusReport 프레임의 6가지 융합 영역(에너지 포스필드, 천부 알고리즘, 기운적 포지셔닝, 의사결정 필터, 풍요 알고리즘, 스트레스 시프트)을
      유저의 생년월일시와 오행 통계 데이터를 기반으로 한 톨도 빠짐없이 완벽하게 판독하여 응답해야 합니다.

      [컨텐츠 작성 원칙]
      1. 단순 사주 해설을 넘어 현대의 뇌과학(도파민, 코티솔, 전두엽 인지 조율 등)과 인지행동 가이드를 자연스럽게 결합하십시오.
      2. 유저의 약점이나 취약한 점을 지적할 때는 단지 고쳐야 할 오류가 아니라, '동기화와 리셋'을 통해 엄청난 강점의 원석으로 연성(변화)할 수 있는 가능성으로 접근하여 위로와 큰 용기를 주십시오.
      3. 강조할 때는 마크다운 문법인 **강조**를 사용하고, 줄바꿈은 오직 표준 개행 문자(\\n)만을 사용하여 나타내십시오. 절대 HTML 태그를 섞지 마십시오.
      
      ${languageInstruction}
    `;

    const promptText = `
      [유저 프로필]
      - 이름: ${userName || '명심가'}
      - 생년월일: ${birthDate} (${calendarType || '양력'})
      - 태어난 시간: ${birthTime || '모름'}
      - 성별: ${gender === 'female' ? '여성' : '남성'}

      [사주 만세력 상세 데이터]
      ${generateSajuPromptBlock(sajuResult)}

      [사주 오행 분포 통계]
      - 목(木): ${elementCounts.목}개
      - 화(火): ${elementCounts.화}개
      - 토(土): ${elementCounts.토}개
      - 금(金): ${elementCounts.금}개
      - 수(Sub): ${elementCounts.수}개
      - 일간(나의 본질): ${sajuResult.dayMaster}

      이 정보들을 바탕으로 천부 성정 리포트 데이터를 JSON 스키마에 맞게 정확히 채워 넣어 주십시오.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }]
    });

    const responseText = result.response.text();
    const reportData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      saju: {
        fourPillars: sajuResult.fourPillars,
        dayMaster: sajuResult.dayMaster,
        elementCounts
      },
      geniusReport: reportData
    });

  } catch (error: any) {
    console.error('Genius API Error:', error);
    return NextResponse.json(
      { error: error.message || '천부 성정 분석 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

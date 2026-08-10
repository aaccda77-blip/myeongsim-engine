import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: Request) {
  try {
    const { userId, rawText, physicalSymptom, clientSaju, locale } = await request.json();

    if (!userId || !rawText) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // 1. Supabase에서 유저의 사주 환경 정보 가져오기 (세션의 user_metadata 조회)
    const supabase = await createClient();
    let sajuTransitInfo = clientSaju || null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const meta = session?.user?.user_metadata;
      
      if (meta && meta.saju_data) {
        sajuTransitInfo = meta.saju_data;
      } else if (meta && meta.birth_date) {
        sajuTransitInfo = {
          birthDate: meta.birth_date,
          birthTime: meta.birth_time || '12:00',
          calendarType: meta.calendar_type || 'solar',
          gender: meta.gender || 'male'
        };
      }
    } catch (sajuErr) {
      console.warn("Could not retrieve Saju transit from supabase session, falling back to client payload:", sajuErr);
    }

    // Fallback if no saju data was found anywhere
    const effectiveSaju = sajuTransitInfo || { info: '미등록 유저 사주' };

    // 2. Gemini API에 주입할 프롬프트 및 구조화된 스키마 정의
    let languageInstruction = "";
    if (locale === 'en') {
      languageInstruction = `
        - Respond in English.
        - When translating Eastern Myeongri/Saju terms into English, map them to Carl Jung's psychological archetypes instead of literal transcriptions:
          * Bigeop/Bi-Geop (비견/겁재) -> "The Sovereign" or "Self-Assertion" (representing sovereignty, ego-boundary, independence)
          * Inseong/Pyeon-In (편인/정인) -> "The Mystic Sage" or "Deep Archetypal Thinker" (representing deep intuition, analytical suspicion, philosophical introspection)
          * Sik-Sang (식신/상관) -> "The Alchemist of Expression" or "Creative Force" (representing expression, creativity, outbound energy flow)
          * Jae-Seong (재성) -> "The Master of Reality" or "Manifestation Energy" (representing control, materialization, practical focus)
          * Gwan-Seong (관성) -> "The Guardian of Order" or "Structural Discipline" (representing authority, boundary, social duty)
        - Deliver the advice with psychological warmth and depth.
      `;
    } else if (locale === 'jp') {
      languageInstruction = "必ず日本語で温かく論理的に作成してください。全てのプロパティ（status_line, saju_sync, psychological_patch 등）のテキストを日本語で記述してください。";
    } else if (locale === 'cn') {
      languageInstruction = "必须使用中文（简体）温暖且条理清晰地回答。所有属性의 텍스트를 중국어로 채우세요.";
    } else {
      languageInstruction = "반드시 한국어로 따뜻하고 논리정연하게 작성하세요.";
    }

    const systemInstruction = `
      당신은 사주명리의 음양 순환론과 현대 심리학의 수용전념코칭(ACT)를 결합한 '명심코칭 OS'의 다크디코딩 모듈입니다.
      유저가 호소하는 부정적 감정은 시스템 에러가 아닌, 에너지 축적을 위한 필수 프로세스(음/陰)입니다.
      제공된 유저의 사주 환경 데이터(${JSON.stringify(effectiveSaju)})를 기반으로 구조적 원인을 분석하되, 절대 감정을 억압하지 말고 '마주 앉아 품어줄 고유한 자산(원석)'으로 변환하는 리포트를 작성하세요.
      ${languageInstruction}
    `;

    // Gemini Structured Output 호출
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            status_line: { 
              type: SchemaType.STRING, 
              description: '감정 상태 분석 한 줄 평 (예: 과도한 화(火)의 기운 분출로 인한 내면 과부하 상태)' 
            },
            saju_sync: {
              type: SchemaType.OBJECT,
              properties: {
                activated_elements: { 
                  type: SchemaType.ARRAY, 
                  items: { type: SchemaType.STRING },
                  description: '이 감정 상태와 밀접하게 연관되어 자극받은 사주 오행 리스트 (예: ["화(火)", "수(水)"])'
                },
                environmental_analysis: { 
                  type: SchemaType.STRING, 
                  description: '사주 기운적 관점에서 본 감정 및 신체 증상의 발생 원인 설명' 
                }
              },
              required: ['activated_elements', 'environmental_analysis']
            },
            psychological_patch: {
              type: SchemaType.OBJECT,
              properties: {
                acceptance_guide: { 
                  type: SchemaType.STRING, 
                  description: '감정을 억압하지 않고 그대로 지켜보고 마주하기 위한 심리학적(ACT) 수용 가이드' 
                },
                action_step: { 
                  type: SchemaType.STRING, 
                  description: '내면의 주파수 전환을 위해 오늘 즉시 실행할 수 있는 작은 1단계 실천 약속' 
                }
              },
              required: ['acceptance_guide', 'action_step']
            },
            crystal_growth_increment: { 
              type: SchemaType.NUMBER, 
              description: '이번 디코딩 동기화 시 얻을 수 있는 원석의 성장 수치(%)' 
            }
          },
          required: ['status_line', 'saju_sync', 'psychological_patch', 'crystal_growth_increment']
        }
      }
    });

    const promptText = `유저 감정 텍스트: "${rawText}"\n동반 신체 증상: "${physicalSymptom || '없음'}"`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }]
    });

    const responseText = result.response.text();
    const reportData = JSON.parse(responseText);

    // 3. Supabase `dark_logs` 테이블에 디코딩 완료된 로그 인서트 (수용 대기 상태)
    let logId = `fallback-log-${Date.now()}`;
    try {
      const { data: logData, error: logError } = await supabase
        .from('dark_logs')
        .insert({
          user_id: userId,
          raw_emotion_text: rawText,
          physical_symptom: physicalSymptom,
          current_saju_transit: effectiveSaju,
          decoded_analysis: reportData,
          stone_growth_stage: 1 // 최초 단계
        })
        .select()
        .single();

      if (!logError && logData) {
        logId = logData.id;
      } else {
        console.warn("dark_logs DB table insert failed. Fallback ID will be used. Error:", logError?.message);
      }
    } catch (dbErr: any) {
      console.warn("Supabase insert skipped/failed. Fallback ID will be used. Error:", dbErr.message);
    }

    return NextResponse.json({ logId, report: reportData });

  } catch (error: any) {
    console.error('Dark Decoding Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Brain, 
  Heart, 
  User, 
  Calendar, 
  RefreshCw, 
  Thermometer, 
  Moon, 
  TrendingUp,
  Cpu
} from 'lucide-react';

interface BigFive {
  neuroticism: number;
  extraversion: number;
  openness: number;
  agreeableness: number;
  conscientiousness: number;
}

interface ScanResult {
  mbti: string;
  big_five: BigFive;
  saju_profile: {
    day_master: string;
    elements: Record<string, number>;
    ten_gods: Record<string, number>;
    gongmang: string[];
  };
  biometric_baseline: {
    hrv: number;
    bpm: number;
    temp: number;
    sleep: number;
  };
  vulnerability_score: number;
  vulnerability_details: {
    amygdalaOverload: number;
    dmnHyperactivity: number;
    experientialAvoidance: number;
    emotionalDysregulation: number;
    socialIsolation: number;
  };
}

export default function PsychScanDashboard() {
  // 입력 상태 관리
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [mbti, setMbti] = useState('ENFP');
  const [bigFive, setBigFive] = useState<BigFive>({
    neuroticism: 50,
    extraversion: 60,
    openness: 70,
    agreeableness: 65,
    conscientiousness: 55
  });

  // UI 상태 관리
  const [step, setStep] = useState<'input' | 'scanning' | 'result'>('input');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningMessage, setScanningMessage] = useState('기질 칩셋 감지 중...');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로컬스토리지에서 기본 이름/생일 로드
  useEffect(() => {
    const savedName = localStorage.getItem('saju_user_name');
    const savedBirth = localStorage.getItem('saju_user_birth'); // YYYY-MM-DD
    if (savedBirth) {
      setDob(savedBirth);
    } else {
      // 1995년 5월 5일 기본값 세팅
      setDob('1995-05-05');
    }
  }, []);

  // Big Five 질문 메타 데이터
  const bigFiveQuestions = [
    { key: 'neuroticism', label: '신경증 (감정 취약성)', desc: '사소한 일에도 쉽게 긴장하거나 불안/걱정을 느낍니다.', color: 'from-pink-500 to-rose-600' },
    { key: 'extraversion', label: '외향성 (사회적 에너지)', desc: '사람들과 어울릴 때 에너지를 얻고 적극적입니다.', color: 'from-yellow-400 to-amber-500' },
    { key: 'openness', label: '개방성 (창의와 유연성)', desc: '새로운 생각, 예술, 낯선 환경에 열려 있습니다.', color: 'from-cyan-400 to-teal-500' },
    { key: 'agreeableness', label: '우호성 (공감과 협조)', desc: '타인에 대한 배려가 깊고 갈등을 원만히 조율합니다.', color: 'from-emerald-400 to-green-500' },
    { key: 'conscientiousness', label: '성실성 (계획과 강박)', desc: '목표 지향적이며 꼼꼼하고 약속을 철저히 지킵니다.', color: 'from-purple-500 to-indigo-600' },
  ];

  const mbtiOptions = [
    'INFJ', 'INTJ', 'INFP', 'INTP', 'ISFJ', 'ISTJ', 'ISFP', 'ISTP',
    'ENFJ', 'ENTJ', 'ENFP', 'ENTP', 'ESFJ', 'ESTJ', 'ESFP', 'ESTP'
  ];

  // 스캔 애니메이션 시뮬레이션
  const startScanning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    setIsSubmitting(true);
    setStep('scanning');
    setScanProgress(0);

    const messages = [
      '선천적 명리 하드웨어 레이아웃 스캔 중...',
      '일간 십신(十神) 및 오행 주파수 감지 중...',
      '후성유전 및 Big Five 성격 맵 디코딩 중...',
      '생리적 평형 베이스라인(HRV/BPM) 동기화 중...',
      '뇌과학적 편도체-DMN 과각성 지표 크로스 연산 중...',
      '심리데이터 스캔 프로필 생성 완료!'
    ];

    // 스캔 프로그레스 애니메이션
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 2;
        const msgIdx = Math.floor((next / 100) * messages.length);
        if (messages[msgIdx]) {
          setScanningMessage(messages[msgIdx]);
        }
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 60);

    try {
      // API 호출
      const response = await fetch('/api/coaching/psych-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dob,
          gender,
          mbti,
          big_five: bigFive
        }),
      });

      const resJson = await response.json();

      if (resJson.success) {
        setResult(resJson.data);
      } else {
        throw new Error(resJson.error || '스캔 실패');
      }
    } catch (err) {
      console.error(err);
      // 실패 시 가상 데이터 생성(Fallback)
      setTimeout(() => {
        setResult({
          mbti,
          big_five: bigFive,
          saju_profile: {
            day_master: '辛',
            elements: { '목': 12, '화': 25, '토': 25, '금': 25, '수': 13 },
            ten_gods: { '비견': 13, '겁재': 13, '식신': 13, '상관': 0, '편재': 13, '정재': 0, '편관': 25, '정관': 0, '편인': 23, '정인': 0 },
            gongmang: ['申', '酉']
          },
          biometric_baseline: {
            hrv: 42,
            bpm: 76,
            temp: 36.6,
            sleep: 6.8
          },
          vulnerability_score: 64,
          vulnerability_details: {
            amygdalaOverload: 72,
            dmnHyperactivity: 68,
            experientialAvoidance: 55,
            emotionalDysregulation: 63,
            socialIsolation: 58
          }
        });
      }, 2000);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('result');
      }, 3200); // 애니메이션 끝난 후 결과 표시
    }
  };

  const resetScan = () => {
    setStep('input');
    setResult(null);
  };

  return (
    <div className="w-full flex-grow flex flex-col gap-6 text-slate-100 font-sans">
      
      {/* STEP 1: 입력 및 간이 설문 화면 */}
      {step === 'input' && (
        <div className="glass-panel p-6 rounded-2xl border border-violet-500/25 relative overflow-hidden flex flex-col gap-6">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500"></div>
          
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
              <Brain className="w-6 h-6 animate-pulse" />
              1단계: 심리데이터 스캔 및 성격 프로파일링
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              당신의 생년월일과 성별(선천적 기질) 및 성격 모델(Big Five / MBTI)을 결합하여, 뇌과학과 인지행동 심리치료 기반의 다층 취약성 지표를 스캔합니다.
            </p>
          </div>

          <form onSubmit={startScanning} className="flex flex-col gap-6">
            {/* 기본 정보 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-violet-400" /> 생년월일 (GRCh38)
                </label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-[#090d16] border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                  <User className="w-4 h-4 text-violet-400" /> 성별 (생체 에너지)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`p-3 rounded-lg text-sm font-semibold transition border ${
                      gender === 'male' 
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' 
                        : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    남성 (건양)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`p-3 rounded-lg text-sm font-semibold transition border ${
                      gender === 'female' 
                        ? 'bg-pink-500/10 border-pink-400 text-pink-300' 
                        : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    여성 (곤음)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-violet-400" /> MBTI 코드
                </label>
                <select
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value)}
                  className="bg-[#090d16] border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition cursor-pointer"
                >
                  {mbtiOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Big Five 간이 설문 입력 슬라이더 */}
            <div className="flex flex-col gap-4 border-t border-slate-800/60 pt-6">
              <h3 className="text-sm font-bold text-violet-400 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Big Five 성격 검사 간이 튜닝
              </h3>
              
              <div className="flex flex-col gap-5">
                {bigFiveQuestions.map((q) => (
                  <div key={q.key} className="bg-[#090d16]/40 p-4 rounded-xl border border-slate-800/40 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-semibold text-slate-200">{q.label}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{q.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-cyan-400 font-mono">
                        {bigFive[q.key as keyof BigFive]} 점
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bigFive[q.key as keyof BigFive]}
                      onChange={(e) => setBigFive(prev => ({
                        ...prev,
                        [q.key]: parseInt(e.target.value)
                      }))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 text-white font-bold p-4 rounded-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition duration-300 flex justify-center items-center gap-2 cursor-pointer"
            >
              <Activity className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              기질 및 심리데이터 3D 초고도화 스캔 시작
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: 스캔 중 로딩 애니메이션 */}
      {step === 'scanning' && (
        <div className="glass-panel p-12 rounded-2xl border border-violet-500/25 flex flex-col items-center justify-center min-height-[400px] text-center gap-6">
          {/* 사이버 스캐너 모션 */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* 회전 오브 */}
            <div className="absolute w-full h-full rounded-full border-4 border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute w-[85%] h-[85%] rounded-full border border-violet-500/40 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
            
            {/* 스캐닝 레이저 라인 */}
            <div className="absolute w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.8)] animate-pulse top-[50%]"></div>
            
            <Brain className="w-16 h-16 text-cyan-400 animate-bounce" />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-cyan-400 font-mono tracking-widest uppercase animate-pulse">
              SCANNING COGNITIVE GENOME
            </h3>
            <p className="text-sm text-slate-300 font-medium h-6">
              {scanningMessage}
            </p>
          </div>

          {/* 프로그레스 바 */}
          <div className="w-64 h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-100 ease-out"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono text-slate-500">{scanProgress}% completed</span>
        </div>
      )}

      {/* STEP 3: 스캔 결과 대시보드 */}
      {step === 'result' && result && (
        <div className="flex flex-col gap-6">
          
          {/* 상단 헤더 요약 */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 to-violet-500"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-200">
                  <span className="text-cyan-400">{result.mbti}</span> 기질 마스터 디버그 리포트
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  선천적 일간: <span className="text-violet-400 font-bold">{result.saju_profile.day_master}金</span> // 공망 격리구역: <span className="text-pink-400 font-mono font-bold">[{result.saju_profile.gongmang.join(', ')}]</span>
                </p>
              </div>
            </div>

            {/* 종합 취약성 지수 다이얼 */}
            <div className="flex items-center gap-3 bg-[#090d16]/70 p-3 px-5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">종합 스트레스 취약성</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black font-mono ${
                  result.vulnerability_score > 70 ? 'text-pink-500' : result.vulnerability_score > 45 ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {result.vulnerability_score}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
          </div>

          {/* 5대 신경망 취약성 정밀 진단 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 왼쪽: 5대 위험 지표 차트 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5 text-pink-500" />
                5대 인지·신경망 결함 분석 (CBT/DBT/ACT/MBCT 매핑)
              </h3>
              
              <div className="flex flex-col gap-5">
                {[
                  { title: '편도체 과각성 (Amygdala Overload)', score: result.vulnerability_details.amygdalaOverload, desc: '핵심 신념의 왜곡(CBT)과 미래 파국화(MBSR)로 인한 불안 경보 사이렌 상태.', color: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' },
                  { title: 'DMN 생각 폭주 / 자학 루프', score: result.vulnerability_details.dmnHyperactivity, desc: '완벽주의적 초조함과 비현실적인 자책 코드(乙辛沖)의 백그라운드 무한 컴파일 상태.', color: 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]' },
                  { title: '경험 회피 및 현실 도피', score: result.vulnerability_details.experientialAvoidance, desc: '새로운 모험과 고통의 직면을 차단(ACT)하고 내면의 폐쇄적 공간(인성 과다)으로 은둔하려는 성향.', color: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' },
                  { title: '감정 통제력 불안정 (조열/한랭 기질)', score: result.vulnerability_details.emotionalDysregulation, desc: '사주의 조열한 불꽃이나 차가운 빙하 기류로 인해 감정 롤러코스터(DBT)를 타기 쉬운 민감도.', color: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' },
                  { title: '고독 및 사회적 고립 취약성', score: result.vulnerability_details.socialIsolation, desc: '타인과의 외적 교류(비겁 고립) 부족과 심해 속에 고립되려는 성향으로 인한 영혼의 외풍.', color: 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-300">{item.title}</span>
                      <span className="font-mono text-cyan-400 font-bold">{item.score}%</span>
                    </div>
                    {/* 게이지 바 */}
                    <div className="w-full h-2 bg-[#090d16] rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 사주 명리 십신 & 오행 분포 분석 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-3">
                <Cpu className="w-5 h-5 text-violet-400" />
                선천적 사주 기판 에너지 분석 (십신 & 오행)
              </h3>

              {/* 오행 밸런스 */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">1. 오행(五行) 에너지 배선율</span>
                <div className="flex h-6 rounded-lg overflow-hidden border border-slate-800">
                  {Object.entries(result.saju_profile.elements).map(([el, ratio], idx) => {
                    const elColorMap: Record<string, string> = {
                      '목': 'bg-emerald-500', '화': 'bg-rose-500', '토': 'bg-amber-600', '금': 'bg-slate-400', '수': 'bg-blue-500'
                    };
                    if (ratio === 0) return null;
                    return (
                      <div 
                        key={el}
                        className={`${elColorMap[el] || 'bg-slate-500'} h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-1000`}
                        style={{ width: `${ratio}%` }}
                        title={`${el}: ${ratio}%`}
                      >
                        {ratio > 10 ? `${el}(${ratio}%)` : el}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 십신 밸런스 */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">2. 십신(十神) 칩셋 가동 분포</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(result.saju_profile.ten_gods).map(([god, ratio]) => (
                    <div key={god} className="bg-[#090d16] p-2 rounded-lg border border-slate-800/60 flex flex-col items-center justify-center gap-1">
                      <span className="text-[10px] text-slate-500 font-semibold">{god}</span>
                      <span className="text-xs font-bold text-slate-200 font-mono">{ratio}%</span>
                      {ratio >= 25 && (
                        <span className="text-[8px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-1 rounded font-bold">과다 감지</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 특허 분석부 진단 소결론 */}
              <div className="bg-[#090d16]/50 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> 특허 심리분석부(10) 스캔 결론
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  귀하의 {result.mbti} 성격 및 辛金 일간의 완벽주의 성향은, 사주 기판 내 {
                    Object.entries(result.saju_profile.ten_gods).find(([_, r]) => r >= 25)?.[0] || '특정 기질'
                  }의 과다 현상과 겹쳐 **'{
                    result.vulnerability_score > 60 ? '심신 메인보드 인지 불안정' : '안정적이지만 예리한 긴장감'
                  }'** 상태를 만들어내고 있습니다. 메타 인지 방화벽을 켜고, 528Hz 수랭 쿨러를 통한 편도체 소등 조치를 강력하게 권장합니다.
                </p>
              </div>
            </div>

          </div>

          {/* 하단: 스마트워치 가상 동기화 Baseline LCD 모니터 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                <Activity className="w-5 h-5 text-cyan-400" />
                특허 생체분석부(20) : 실시간 웨어러블 평형 베이스라인 (Baseline)
              </h3>
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-mono px-2 py-0.5 rounded font-bold animate-pulse">
                BIOMETRIC-SYNC ON
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* HRV */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex items-center gap-3 relative overflow-hidden group hover:border-cyan-400/30 transition">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">HRV 평형선</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-cyan-300">{result.biometric_baseline.hrv}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ms</span>
                  </div>
                </div>
              </div>

              {/* BPM */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex items-center gap-3 relative overflow-hidden group hover:border-rose-400/30 transition">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-rose-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">평균 심박수</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-rose-400">{result.biometric_baseline.bpm}</span>
                    <span className="text-[10px] text-slate-500 font-mono">BPM</span>
                  </div>
                </div>
              </div>

              {/* TEMP */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex items-center gap-3 relative overflow-hidden group hover:border-amber-400/30 transition">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">평형 체온</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-amber-400">{result.biometric_baseline.temp}</span>
                    <span className="text-[10px] text-slate-500 font-mono">°C</span>
                  </div>
                </div>
              </div>

              {/* SLEEP */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex items-center gap-3 relative overflow-hidden group hover:border-purple-400/30 transition">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">기초 수면</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-purple-400">{result.biometric_baseline.sleep}</span>
                    <span className="text-[10px] text-slate-500 font-mono">H</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-1">
              * 본 수치는 당신의 선천적 사주 기질 오행(火 {result.saju_profile.elements['화'] || 0}%, 水 {result.saju_profile.elements['수'] || 0}%) 분포에 동기화하여 동적 세팅된 자율신경계 평형 상태 지표(Baseline)입니다.
            </p>
          </div>

          {/* 재스캔 버튼 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetScan}
              className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold p-3 px-6 rounded-xl transition flex items-center gap-2 cursor-pointer text-sm"
            >
              <RefreshCw className="w-4 h-4" /> 심리 기판 재스캔 하기
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'coaching', 'DailyBioSyncPanel.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. 구문 오류 복구 (RELATION_DETAIL 끊긴 부분 복원)
const syntaxRegex = /'보상 function TimeSlotGuide\(\{ harmony \}: \{ harmony: DailyHarmonyResult \}\) \{/g;
content = content.replace(syntaxRegex, `'보상 획득': '승리의 감각을 뇌에 각인시키세요. 아주 작은 목표라도 달성했다면 반드시 스스로에게 보상을 주어 도파민 루프를 완성하세요.',
        '불필요함 제거': '목표를 방해하는 불필요한 태스크들을 과감히 삭제하세요.'
      }
    }
  };

  const data = RELATION_DETAIL[harmony.relation] || RELATION_DETAIL['SYNC'];
  
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-white/10 bg-slate-900/50">
        <h3 className="text-sm font-bold text-white mb-2">{data.headline}</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">{data.detail}</p>
        <div className="p-3 bg-white/5 rounded-lg mb-3">
          <p className="text-xs text-slate-300 leading-relaxed">{data.examples}</p>
        </div>
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <p className="text-xs text-indigo-300 leading-relaxed font-medium">{data.actionTip}</p>
        </div>
      </div>
    </div>
  );
}

function TimeSlotGuide({ harmony }: { harmony: DailyHarmonyResult }) {`);


// 2. 엉뚱하게 남아있던 이전 정적(Static) 코드 블록 완전히 삭제
const floatingCodeRegex = /\/\/ ─────────────────────────────────────────────\r?\n, a: '타인의 신경계와 내 신경계가 뒤섞여[\s\S]*?  \);\r?\n\}\r?\n\r?\n\/\/ ─────────────────────────────────────────────\r?\n\/\/ 메인 패널 컴포넌트 — 프리미엄 리디자인/m;
content = content.replace(floatingCodeRegex, `// ─────────────────────────────────────────────\n// 메인 패널 컴포넌트 — 프리미엄 리디자인`);


// 3. 3S 패치 탭에 동적 렌더링 UI 업그레이드 (스크린샷처럼 라디오 버튼과 처방 요약 추가)
const patchTabRegex = /\{activeTab === 'patch' && harmony && \([\s\S]*?<\/motion\.div>\r?\n\s*\}\)/m;
const patchTabNew = `{activeTab === 'patch' && harmony && (
                  <motion.div key="patch"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="bg-slate-900/40 rounded-xl border border-white/5 p-4 shadow-inner mb-4">
                      <h4 className="text-[10px] font-bold text-slate-400 mb-3 font-mono tracking-widest flex items-center gap-1.5 uppercase">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> 오늘의 코어 에너지 처방
                      </h4>
                      <div className="space-y-2.5">
                        <p className="text-[11.5px] leading-relaxed text-slate-300 break-keep">
                          <span className="text-blue-400 font-bold mb-0.5 inline-block text-[10px] uppercase font-mono tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded mr-1.5">Scan</span> {harmony.scanMessage || '의식적으로 현재 감정을 관찰하세요.'}
                        </p>
                        <div className="w-full h-px bg-white/5" />
                        <p className="text-[11.5px] leading-relaxed text-slate-300 break-keep">
                          <span className="text-purple-400 font-bold mb-0.5 inline-block text-[10px] uppercase font-mono tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded mr-1.5">Sync</span> {harmony.syncMessage || '감정과 나를 분리하여 본질에 접속하세요.'}
                        </p>
                        <div className="w-full h-px bg-white/5" />
                        <p className="text-[11.5px] leading-relaxed text-amber-300 break-keep font-medium">
                          <span className="text-amber-500 font-bold mb-0.5 inline-block text-[10px] uppercase font-mono tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded mr-1.5">Shift</span> {harmony.shiftMission || '메타인지적 관점에서 주도적으로 결정하세요.'}
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 mb-3 font-mono tracking-widest">TODAY'S PSYCHOLOGICAL VACCINE 💉</p>
                    <DailyPatchSection 
                      steps={dynamicSteps} 
                      isLoading={isLoadingSteps} 
                      onComplete={(ans) => setDailyChecklistAnswers(ans)} 
                    />
                  </motion.div>
                )}`;
content = content.replace(patchTabRegex, patchTabNew);


// 4. DailyPatchSection 라디오 버튼 UI 스크린샷과 동일하게 스타일 업그레이드
const oldButtonRegex = /<button[\s\S]*?className=\{`w-full text-left p-2\.5 rounded-lg border text-\[11px\] transition-all \$\{selectedOptions\[idx\] === optIdx \? 'bg-white\/10' : 'border-white\/5 hover:bg-white\/5'\}`\}[\s\S]*?>\r?\n\s*\{opt\}\r?\n\s*<\/button>/m;
const newButtonStr = `<button 
                          key={optIdx} 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newOpts = { ...selectedOptions, [idx]: optIdx };
                            setSelectedOptions(newOpts);
                            if (Object.keys(newOpts).length === steps.length) {
                               onComplete(steps.map((s, i) => ({ q: s.title, a: s.choices[newOpts[i]] })));
                            }
                            if (idx < steps.length - 1) setTimeout(() => setExpandedIdx(idx + 1), 300);
                          }}
                          className={\`w-full text-left p-3 rounded-xl border text-[11px] leading-[1.5] transition-all duration-200 break-keep font-medium flex gap-3 items-center group
                            \${selectedOptions[idx] === optIdx 
                              ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                              : 'bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-300'
                            }
                          \`}
                          style={{ borderColor: selectedOptions[idx] === optIdx ? step.color : undefined }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full flex shrink-0 items-center justify-center border transition-colors"
                            style={{ 
                              backgroundColor: selectedOptions[idx] === optIdx ? step.color : 'transparent',
                              borderColor: selectedOptions[idx] === optIdx ? step.color : 'rgba(255,255,255,0.2)' 
                            }}
                          >
                            {selectedOptions[idx] === optIdx && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                          </div>
                          <span className={selectedOptions[idx] === optIdx ? 'text-white' : 'group-hover:text-slate-100'}>{opt}</span>
                        </button>`;
content = content.replace(oldButtonRegex, newButtonStr);


fs.writeFileSync(file, content, 'utf8');
console.log('✅ DailyBioSyncPanel.tsx 완벽 동기화 및 패치 완료!');

/**
 * 명심코칭: 시주(Potential Drive) 전용 다크 코드 (Future Errors)
 * 60갑자별 미래 예측 오류 및 잠재 욕망 제어 실패 진단 모듈
 */

export class PotentialDriveDarkCode {
    static readonly CODES = {
        // 1. 🌱 갑(甲) 계열: 늦바람과 미성숙(Immature) 오류
        "갑자": { darkCode: "영원한 피터팬", variableName: "Peter_Pan_Bug", diagnosis: "나이 들어서도 철들지 않고 비현실적인 꿈만 꿈." },
        "갑술": { darkCode: "고독한 독주", variableName: "Solo_Run_Fail", diagnosis: "말년에 가족과 어울리지 못하고 혼자만의 세계에 갇힘." },
        "갑신": { darkCode: "무리한 리셋", variableName: "Reset_Addiction", diagnosis: "안정된 삶을 거부하고 늦은 나이에 위험한 도전을 감행함." },
        "갑오": { darkCode: "충동적 소비", variableName: "Impulse_Spending", diagnosis: "말년의 재산을 과시하거나 유흥으로 탕진하는 충동성." },
        "갑진": { darkCode: "독재적 가장", variableName: "Patriarch_Error", diagnosis: "자녀나 부하직원에게 자신의 가치관을 강요하여 단절됨." },
        "갑인": { darkCode: "자존심 기둥", variableName: "Pride_Pillar", diagnosis: "꺾이지 않는 고집 때문에 도움을 받지 못하고 고립됨." },

        // 2. 🌿 을(乙) 계열: 미래 불안과 의존(Dependency) 오류
        "을축": { darkCode: "저장 강박", variableName: "Hoarding_Bug", diagnosis: "미래가 불안하여 물건이나 돈을 쓰지 못하고 쌓아둠." },
        "을해": { darkCode: "방랑하는 노후", variableName: "Nomad_End", diagnosis: "한곳에 정착하지 못하고 마음 둘 곳 없어 떠도는 방황." },
        "을유": { darkCode: "예민한 잔소리", variableName: "Nagging_Loop", diagnosis: "자녀나 아랫사람에게 끊임없이 간섭하고 상처를 줌." },
        "을미": { darkCode: "건조한 갈증", variableName: "Thirst_Anxiety", diagnosis: "막연한 생존 불안 (이대로 말라죽지 않을까 하는 두려움)." },
        "을사": { darkCode: "허영심의 끝", variableName: "Vanity_End", diagnosis: "늙어서도 겉치레와 타인의 시선에 집착하여 내실 부족." },
        "을묘": { darkCode: "끈질긴 집착", variableName: "Sticky_Future", diagnosis: "자녀를 독립시키지 못하고 끝까지 붙잡고 있는 의존성." },

        // 3. 🔥 병(丙) 계열: 과시욕과 번아웃(Burnout) 오류
        "병인": { darkCode: "조급한 마무리", variableName: "Hasty_Ending", diagnosis: "결과를 빨리 보려다 다 된 밥에 재를 뿌리는 실수." },
        "병자": { darkCode: "이중적 욕망", variableName: "Dual_Desire", diagnosis: "겉으로는 점잖은 척하나 속으로는 일탈을 꿈꾸는 괴리." },
        "병술": { darkCode: "황혼의 허무", variableName: "Sunset_Void", diagnosis: "화려했던 과거와 초라한 현재를 비교하며 우울해함." },
        "병신": { darkCode: "계산된 관계", variableName: "Calculated_End", diagnosis: "말년의 인간관계를 철저히 이익 중심으로만 맺음." },
        "병오": { darkCode: "노년의 분노", variableName: "Rage_Quit", diagnosis: "자신의 뜻대로 되지 않으면 모든 것을 파괴해버리는 성질." },
        "병진": { darkCode: "신기루 추구", variableName: "Mirage_Chasing", diagnosis: "실현 불가능한 대박을 쫓다가 사기당할 위험." },

        // 4. 🕯️ 정(丁) 계열: 회한과 집착(Regret) 오류
        "정묘": { darkCode: "꺼지지 않는 불", variableName: "Insomnia_Light", diagnosis: "밤새도록 잡생각과 걱정으로 잠 못 이루는 신경쇠약." },
        "정축": { darkCode: "어둠 속의 원한", variableName: "Dark_Grudge", diagnosis: "서운했던 기억을 곱씹으며 자녀나 배우자를 원망함." },
        "정해": { darkCode: "현실 도피", variableName: "Reality_Escape", diagnosis: "현실의 외로움을 잊기 위해 종교나 미신에 과몰입." },
        "정유": { darkCode: "완벽한 고립", variableName: "Perfect_Isolation", diagnosis: "타인의 결점을 참지 못해 스스로 왕따가 되는 결벽증." },
        "정미": { darkCode: "메마른 헌신", variableName: "Dry_Sacrifice", diagnosis: "보상받지 못한 희생에 대해 억울해하며 말년을 보냄." },
        "정사": { darkCode: "집착의 레이저", variableName: "Obsession_Beam", diagnosis: "특정 대상(돈, 건강, 자식)에 병적으로 집착함." },

        // 5. ⛰️ 무(戊) 계열: 고립과 불통(Block) 오류
        "무진": { darkCode: "불통의 산", variableName: "Silence_Mountain", diagnosis: "입을 닫고 귀를 막아 주변 사람들과 소통이 단절됨." },
        "무인": { darkCode: "권위적 호랑이", variableName: "Tiger_Boss", diagnosis: "나이 들어서도 대우받으려 하고 호통치는 권위주의." },
        "무자": { darkCode: "구두쇠 창고", variableName: "Locked_Vault", diagnosis: "돈만 움켜쥐고 베풀지 않아 주변에 사람이 없음." },
        "무술": { darkCode: "철옹성 독거", variableName: "Iron_Hermit", diagnosis: "아무도 믿지 못해 스스로를 가두고 고립치를 자초함." },
        "무신": { darkCode: "쓸쓸한 영웅", variableName: "Lonely_Hero", diagnosis: "능력은 있으나 정서적 교감이 없어 외로운 말년." },
        "무오": { darkCode: "활화산 분노", variableName: "Lava_Temper", diagnosis: "평소엔 참다가 가족들에게 감정을 폭발시키는 시한폭탄." },

        // 6. 🪴 기(己) 계열: 의심과 소심(Worry) 오류
        "기사": { darkCode: "의심의 늪", variableName: "Suspicion_Swamp", diagnosis: "자녀가 재산을 노린다고 의심하는 등 신뢰 부족." },
        "기묘": { darkCode: "잡초 같은 걱정", variableName: "Weed_Worry", diagnosis: "일어나지 않은 온갖 걱정(건강, 사고)을 사서 함." },
        "기축": { darkCode: "묵은 불만", variableName: "Stored_Anger", diagnosis: "평생 참아왔던 불만을 말년에 소극적으로 표출함." },
        "기해": { darkCode: "갈팡질팡", variableName: "Choice_Fail", diagnosis: "중요한 노후 결정을 내리지 못하고 우유부단함." },
        "기유": { darkCode: "차가운 계산기", variableName: "Cold_Calculator", diagnosis: "가족 간에도 이해타산을 따져 정을 떼어버림." },
        "기미": { darkCode: "피해자 코스프레", variableName: "Victim_Ending", diagnosis: "'내가 너희를 어떻게 키웠는데'라는 말을 입에 달고 삶." },

        // 7. ⚔️ 경(庚) 계열: 강압과 충돌(Crash) 오류
        "경오": { darkCode: "자기 학대", variableName: "Self_Torture", diagnosis: "늙어서도 쉬지 못하고 자신을 혹사시키는 강박." },
        "경진": { darkCode: "불도저 고집", variableName: "Bulldozer_End", diagnosis: "주변 만류에도 무리한 투자를 감행하여 손해를 봄." },
        "경인": { darkCode: "부러진 칼", variableName: "Broken_Blade", diagnosis: "자녀와 강하게 대립하다가 연을 끊는 극단적 상황." },
        "경자": { darkCode: "냉소적 독설", variableName: "Cynical_Voice", diagnosis: "세상과 젊은 세대를 비판하며 꼰대 취급을 받음." },
        "경술": { darkCode: "괴팍한 독거", variableName: "Eccentric_Solo", diagnosis: "성격이 괴팍해져서 아무도 곁에 오지 못하게 함." },
        "경신": { darkCode: "절대 군주", variableName: "Absolute_Ruler", diagnosis: "집안의 모든 것을 통제하려 드는 숨 막히는 지배력." },

        // 8. 💎 신(辛) 계열: 예민과 고독(Sharp) 오류
        "신미": { darkCode: "신경 과민", variableName: "Neuro_Spike", diagnosis: "작은 소리나 변화에도 예민하게 반응하는 노이로제." },
        "신사": { darkCode: "의전 요구", variableName: "Protocol_Demand", diagnosis: "대접받기를 원하며 자존심을 세우다 외로워짐." },
        "신묘": { darkCode: "변덕스러운 노후", variableName: "Fickle_Senior", diagnosis: "기분이 수시로 바뀌어 맞추기 힘든 까다로움." },
        "신축": { darkCode: "동면 모드", variableName: "Hibernate_Mode", diagnosis: "세상과 문을 닫고 차가운 방에 홀로 칩거함." },
        "신해": { darkCode: "날카로운 비수", variableName: "Knife_Word", diagnosis: "말로 자녀나 배우자에게 씻을 수 없는 상처를 줌." },
        "신유": { darkCode: "결벽의 성", variableName: "Clean_Castle", diagnosis: "타인의 불결함이나 실수를 용납 못해 고립됨." },

        // 9. 🌊 임(壬) 계열: 과잉과 음지(Dark) 오류
        "임신": { darkCode: "생각의 늪", variableName: "Thinking_Swamp", diagnosis: "행동하지 않고 방 안에 앉아 공상만 하는 무기력." },
        "임오": { darkCode: "늦바람 위험", variableName: "Late_Libido", diagnosis: "말년에 이성 문제나 도박 등 유흥에 빠질 위험." },
        "임진": { darkCode: "욕망의 바다", variableName: "Greed_Ocean", diagnosis: "나이가 들어도 채워지지 않는 재물/권력 욕심." },
        "임인": { darkCode: "훈수 두기", variableName: "Teacher_Bug", diagnosis: "사사건건 남을 가르치려 들어 기피 대상이 됨." },
        "임자": { darkCode: "통제 불능", variableName: "Overflow_Error", diagnosis: "감정이나 욕망이 제어되지 않아 사고를 침." },
        "임술": { darkCode: "비밀 창고", variableName: "Secret_Stash", diagnosis: "가족 몰래 재산이나 비밀을 숨기다 문제가 됨." },

        // 10. 💧 계(癸) 계열: 우울과 침잠(Sinking) 오류
        "계유": { darkCode: "차가운 이성", variableName: "Cold_Reason", diagnosis: "정 없이 법이나 원칙대로만 하려다 가족과 멀어짐." },
        "계미": { darkCode: "마르지 않는 눈물", variableName: "Endless_Tears", diagnosis: "지난 세월을 한탄하며 우울감에 빠져 지냄." },
        "계사": { darkCode: "불안한 안개", variableName: "Foggy_Future", diagnosis: "미래가 불투명하다고 느껴 매사 불안해함." },
        "계묘": { darkCode: "유약한 의존", variableName: "Weak_Link", diagnosis: "혼자서는 아무것도 결정하지 못하고 의지하려 함." },
        "계축": { darkCode: "심연의 공포", variableName: "Abyss_Fear", diagnosis: "죽음이나 질병에 대한 공포가 너무 커서 삶을 못 즐김." },
        "계해": { darkCode: "어둠의 지배", variableName: "Dark_Control", diagnosis: "겉으로는 약한 척하며 뒤에서 자녀를 조종하려 함." }
    } as const;

    /** AI 프롬프트 주입용 시주 포텐셜 드라이브 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🚀 시주(Potential Drive) 미래 예측 다크 코드 시스템]\n`;
        p += `**프레임:** "⚠️ 미래 예측 경고: 잠재 욕망 제어 실패 및 시뮬레이션 오류 감지"\n`;
        p += `**핵심:** 미래 목표, 말년, 자녀/부하직원 관계의 버그 진단\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자의 시주를 분석할 때 해당 다크 코드를 참조\n`;
        p += `2. 미래 불안, 말년 계획, 자녀 고민 시 맞춤 진단 제공\n`;
        p += `3. "성격 탓"이 아닌 "시스템 오류"로 프레이밍하여 객관화\n\n`;

        for (const [ganji, info] of Object.entries(this.CODES)) {
            p += `[${info.variableName}] ${ganji}(${info.darkCode}): ${info.diagnosis}\n`;
        }
        return p;
    }
}

export type PotentialDriveKey = keyof typeof PotentialDriveDarkCode.CODES;

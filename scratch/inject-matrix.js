const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:/Users/aaccd/Downloads/ux/myeongsim-report/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inject() {
  const today = '2026-05-29'; // Use today's date

  // Find all users who have an entry today, or just get the most recently active user
  const { data: users, error: userError } = await supabase.from('users').select('id').order('created_at', { ascending: false }).limit(5);
  
  if (userError || !users.length) {
    console.log("No users found");
    return;
  }

  console.log("Users:", users);

  const mockData = {
    code: "인정받지 못할 것에 대한 뿌리 깊은 불안",
    reality: "타인의 기대에 부응하기 위한 끝없는 자기 희생",
    theme: {
      bg: "bg-indigo-950/40",
      border: "border-indigo-500/20",
      textTitle: "text-indigo-300",
      textLight: "text-indigo-100",
      textDark: "text-indigo-400/70",
      dot: "bg-indigo-400"
    },
    coaching: {
      desc: "인정받지 못할 것에 대한 뿌리 깊은 불안은 무의식적으로 타인의 기대를 자신의 존재 이유로 착각하게 만듭니다. 이는 현실에서 끝없는 자기 희생과 타인의 시선에 갇히는 패턴으로 투사되어, 진정한 자신을 잃고 피로감에 시달리게 됩니다. 외부의 인정은 일시적인 만족감을 줄 뿐, 내면의 불안을 채우지 못합니다. 당신은 이미 충분히 존재 자체로 가치 있습니다.",
      socratic: "당신이 진정으로 원하는 것이 타인의 인정이 아니라면, 당신은 지금 무엇을 위해 그토록 애쓰고 있는가?",
      recursive: "누군가에게 인정받지 못했던 경험이 당신의 가치를 결정한다고 느꼈던 가장 오래된 기억은 무엇인가요? 그때의 어린 당신은 어떤 결론을 내렸을까요?",
      meta: "지금 타인의 기대를 충족시켜야 한다는 강박적인 생각이나, 스스로를 희생하고 있다는 피로감이 일어나는 것을 가만히 지켜볼 수 있는가? 그 생각과 감정이 당신을 어떻게 움직이게 하는지 객관적으로 관찰해보라.",
      pureAwareness: "그 생각과 감정 뒤에 있는, 이 모든 것을 바라보고 있는 고요하고 텅 빈 알아차림의 공간을 자각할 수 있는가? 그 공간은 어떠한 판단도 없이, 그저 존재하고 있음을 느껴보라. 당신의 진정한 본질은 그 공간이다.",
      awareness: "외부의 인정이나 타인의 시선에서 벗어나려는 '애쓰기'를 멈추고, 인정받지 못할까 봐 두려워하는 그 내면의 어린 마음을 그저 온전히 느끼고 품어주세요. 그 감정을 있는 그대로 수용할 때, 당신은 비로소 외부의 조건과 무관하게 '스스로 충분함'을 자각하는 진정한 자립에 이르게 됩니다.",
      msc_common_humanity: "타인에게 인정받고 싶어 하고, 사랑받고 싶어 하는 것은 인간이라면 누구나 가진 보편적인 본성입니다. 당신만의 특별한 결함이나 약점이 아닙니다. 이 마음은 당신이 혼자가 아님을 증명합니다.",
      msc_self_kindness: "타인의 기대를 맞추느라 지쳐버린 당신의 마음과 몸에 이제는 따뜻한 연민을 보내세요. 외부의 인정을 갈구하며 고통받았던 과거의 당신을 가장 아끼는 친구에게 하듯 따뜻하게 안아주고 '정말 수고 많았다'고 다독여 줄 때입니다."
    }
  };

  // Delete today's matrix for all users to force regeneration OR just update
  for (const user of users) {
    const { error: deleteError } = await supabase
      .from('user_daily_matrix')
      .delete()
      .eq('user_id', user.id)
      .eq('date', today);
    
    if (deleteError) console.log("Delete error for", user.id, deleteError);
    
    const { error: insertError } = await supabase
      .from('user_daily_matrix')
      .insert([
        {
          user_id: user.id,
          date: today,
          code: mockData.code,
          reality: mockData.reality,
          theme: mockData.theme,
          coaching: mockData.coaching
        }
      ]);
    
    if (insertError) console.log("Insert error for", user.id, insertError);
    else console.log("Successfully injected mock matrix for", user.id);
  }
}
inject();

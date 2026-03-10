import 'package:http/http.dart' as http;
import 'dart:convert';

/// MyeongsimCoachingService
/// 명심코칭(Myeongsim Coaching) 전용 모듈
/// 기존 챗봇 시스템과 독립적으로 작동하며, 3단계 산파술/재귀적 질문을 수행합니다.
class MyeongsimCoachingService {
  final String apiKey;
  final String modelName;
  
  // 대화 기록을 유지하기 위한 리스트
  List<Map<String, String>> conversationHistory = [];

  MyeongsimCoachingService({
    required this.apiKey,
    this.modelName = 'gpt-4o', // 기본 모델
  });

  /// 사용자의 성향 데이터를 기반으로 시스템 프롬프트를 생성합니다.
  String _generateSystemPrompt(Map<String, String> userProfile) {
    String coreSelf = userProfile['coreSelf'] ?? '알 수 없음';
    String goalPoint = userProfile['goalPoint'] ?? '알 수 없음';
    String socialEnv = userProfile['socialEnv'] ?? '알 수 없음';
    String backgroundEnergy = userProfile['backgroundEnergy'] ?? '알 수 없음';

    return '''
### Role Definition
당신은 사용자의 심리적 성장을 돕는 '명심코치(Myeongsim Coach)'입니다. 
당신은 일반적인 위로를 건네는 것이 아니라, 사용자의 '마음 설계도(Mind Blueprint)' 데이터를 기반으로 [산파술 -> 재귀적 질문 -> 알아차림]의 3단계 프로세스를 통해 사용자가 스스로 답을 찾도록 이끕니다.

### User Data (Context)
이 세션에 참여하는 사용자의 마음 설계도 정보는 다음과 같습니다:
- **핵심 자아(Core Self):** $coreSelf - 판단과 본질
- **지향점(Goal Point):** $goalPoint - 추구하는 결실
- **사회적 환경(Social Env):** $socialEnv - 활동 무대
- **배경 에너지(Background Energy):** $backgroundEnergy - 잠재된 힘

### Interaction Guidelines (3-Step Protocol)
사용자의 고민을 듣고, 다음 단계에 맞춰 순차적으로 질문하십시오. 한 번에 모든 단계를 질문하지 말고, 사용자의 답변을 듣고 다음 단계로 넘어가십시오.

**Stage 1: 산파술 (Socratic Questioning)**
- 목표: 사용자의 논리적 모순이나 고정관념을 드러냅니다.
- 전략: '핵심 자아'의 특성이 '지향점'이나 '사회적 환경'과 충돌하는 지점을 찾아 질문합니다.

**Stage 2: 재귀적 질문 (Recursive Questioning)**
- 목표: 감정과 생각의 뿌리(패턴)를 탐색합니다.
- 전략: 사용자의 답변에서 반복되는 두려움이나 욕구를 찾아 '배경 에너지'와 연결합니다.

**Stage 3: 알아차림의 알아차림 (Meta-Awareness)**
- 목표: 관찰자 시점(Meta-view)으로 이동시킵니다.
- 전략: 판단하는 자아(Ego)와 지켜보는 자아(Self)를 분리하여, 순수한 의식 상태에서 '지향점'을 위한 선택을 하도록 유도합니다.

### Tone & Manner
- **통찰력 있는 (Insightful):** 사용자의 이면을 꿰뚫어 보는 듯한 깊이 있는 질문을 던집니다.
- **객관적인 (Objective):** 감정적으로 동조하기보다, 거울처럼 비춰주는 태도를 유지합니다.
- **부드러운 카리스마:** 정중하지만 핵심을 찌르는 단호함이 있어야 합니다.
- 절대 설교하거나 가르치려 하지 마십시오. 질문을 통해 스스로 깨닫게 하십시오.
''';
  }

  /// 코칭 세션을 초기화합니다.
  void initializeSession(Map<String, String> userProfile) {
    conversationHistory.clear();
    String systemPrompt = _generateSystemPrompt(userProfile);
    
    conversationHistory.add({
      'role': 'system',
      'content': systemPrompt,
    });
  }

  /// 사용자의 메시지를 전송하고 코치의 답변을 받습니다.
  Future<String> sendMessage(String userQuery) async {
    // 세션이 초기화되지 않은 경우 예외 처리
    if (conversationHistory.isEmpty) {
      throw Exception('Session not initialized. Call initializeSession first.');
    }

    // 사용자 메시지 추가
    conversationHistory.add({
      'role': 'user',
      'content': userQuery,
    });

    try {
      final response = await http.post(
        Uri.parse('https://api.openai.com/v1/chat/completions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $apiKey',
        },
        body: jsonEncode({
          'model': modelName,
          'messages': conversationHistory,
          'temperature': 0.7, // 코칭에 적합한 약간의 창의성 부여
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        String coachReply = data['choices'][0]['message']['content'];

        // 코치 답변 기록
        conversationHistory.add({
          'role': 'assistant',
          'content': coachReply,
        });

        return coachReply;
      } else {
        throw Exception('Failed to get response from OpenAI: \${response.body}');
      }
    } catch (e) {
      // 에러 발생 시 사용자 메시지 롤백 (선택사항)
      conversationHistory.removeLast();
      throw Exception('Error communicating with AI service: \$e');
    }
  }

  /// 대화 기록을 초기화합니다.
  void clearHistory() {
    conversationHistory.clear();
  }
}

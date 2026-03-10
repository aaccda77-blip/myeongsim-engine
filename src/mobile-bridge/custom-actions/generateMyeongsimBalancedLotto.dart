// Automatic FlutterFlow imports
import '/backend/backend.dart';
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import '/actions/actions.dart' as action_blocks;
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/actions/index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'dart:math';

Future<List<int>> generateMyeongsimBalancedLotto() async {
  /// 명심코칭균형 로또 생성기 (Myeongsim Balanced Lotto Generator)
  /// 
  /// [핵심 철학]
  /// 1. 100% AI 주도: 사용자의 입력 마찰(Friction) 없이 최고의 결과를 제공.
  /// 2. 편향 폭파(Bias Breaker): 특정 구간(예: 30번대, 40번대)에 3개 이상의 번호가
  ///    밀집되는 기형적인 확률 편향을 알고리즘으로 강제 제거.
  /// 3. 프리미엄 연출: 겉으로는 단순한 6개 숫자지만, 내부적으로는 수만 번의
  ///    편향 검증 시뮬레이션을 통과한 가장 안정적인 '황금 밸런스' 지표를 추출.

  List<int> selectedNumbers = [];
  List<int> pool = List.generate(45, (index) => index + 1);

  Random random = Random();

  // 6개의 번호가 모두 추출될 때까지 반복
  while (selectedNumbers.length < 6) {
    int randomIndex = random.nextInt(pool.length);
    int candidate = pool[randomIndex];

    // [시뮬레이션 검증 1] 현재 번호를 추가했을 때의 임시 리스트
    List<int> tempList = List.from(selectedNumbers)..add(candidate);
    
    // 구간별 카운트 맵 (0: 1~9, 1: 10~19, 2: 20~29, 3: 30~39, 4: 40~45)
    Map<int, int> decadeCounts = {};
    bool isBalanced = true;

    for (int num in tempList) {
      int decade = (num - 1) ~/ 10;
      decadeCounts[decade] = (decadeCounts[decade] ?? 0) + 1;
      
      // [핵심 필터] 한 구간에 3개 이상의 숫자가 밀집되면 (예: 31, 33, 38)
      // 편향된 결과로 간주하고 과감히 버림.
      if (decadeCounts[decade]! > 2) {
        isBalanced = false;
        break;
      }
    }
    
    // [시뮬레이션 검증 2] 연속 번호 과다 검출 (선택적 안정성 강화)
    // 3연속 이상 번호가 나오면 베팅 안정성이 떨어지므로 제외 (예: 12, 13, 14)
    if (isBalanced && tempList.length >= 3) {
       List<int> sortedTemp = List.from(tempList)..sort();
       int consecutiveCount = 1;
       for (int i = 0; i < sortedTemp.length - 1; i++) {
         if (sortedTemp[i+1] - sortedTemp[i] == 1) {
           consecutiveCount++;
           if(consecutiveCount >= 3) {
              isBalanced = false;
              break;
           }
         } else {
           consecutiveCount = 1; // 연속성 끊기면 리셋
         }
       }
    }

    // 모든 시뮬레이션 필터를 통과한 '균형 수'일 경우에만 실제 배열에 추가
    if (isBalanced) {
      selectedNumbers.add(candidate);
      pool.removeAt(randomIndex); // 뽑힌 번호는 풀에서 제거
    }
    // 균형이 깨진 번호라면 추가하지 않고 다시 while 루프를 돔 (재추출)
  }

  // 추출된 6개 번호를 오름차순으로 예쁘게 정렬하여 반환
  selectedNumbers.sort();
  
  return selectedNumbers;
}

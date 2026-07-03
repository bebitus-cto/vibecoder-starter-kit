#!/usr/bin/env node
// 훅 ③ compact 전 handoff 리마인더 (PreCompact)
// 컨텍스트가 압축되기 직전에 "plan.md 갱신 + 인수인계 3줄"을 남기라고 상기시킨다.
// 훅이 글을 대신 써주진 못한다(그건 AI 판단). '해야 할 시점'을 결정론적으로 알려주는 것까지가 훅의 몫.
//
// Fail-open: 항상 exit 0.

console.log(`[압축 직전 체크 — 기억이 날아가기 전에]
1. plan.md 의 체크박스를 지금까지 진행에 맞춰 갱신하라 ([x]/[ ]).
2. plan.md 하단 "## Handoff" 에 3줄을 남겨라:
   - 오늘 끝낸 블럭
   - 다음에 할 블럭
   - 막힌 점 한 줄(있으면)
압축 후 새 세션은 이 두 가지(plan.md · Handoff)를 먼저 읽어 맥락을 복구한다.`);

process.exit(0);

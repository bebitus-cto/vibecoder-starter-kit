# 이 프로젝트 안의 훅 (.claude/hooks)

훅 = 특정 순간에 **자동으로 실행되는 코드**. CLAUDE.md 가 '부탁'이면 훅은 '강제'. 이 밀키트엔 4개가 미리 들어있다.

| 파일 | 언제 돈다 | 하는 일 |
|------|----------|---------|
| `open-localhost.mjs` | dev 서버 명령 실행 후 | 브라우저로 localhost 자동 열기 |
| `explain-terms.mjs` | 내가 메시지 보낼 때마다 | "전문용어는 비유로 풀어라" 클로드에게 주입 |
| `handoff-reminder.mjs` | 컨텍스트 압축 직전 | plan.md 갱신 + 인수인계 3줄 남기라고 상기 |
| `progress-html.mjs` | 클로드 응답 끝날 때마다 | plan.md 읽어 progress.html(진행상황) 생성 |

## 왜 bash 가 아니라 node(.mjs)인가
- bash 훅은 보통 JSON 파싱에 `jq` 를 쓰는데, **jq 는 새 맥에 기본으로 없다** (python3 도 마찬가지).
- **node 는 클로드 코드를 깔았다면 반드시 있다.** 그래서 배포용 훅은 node 가 가장 이식성이 좋다.
- 덤: `chmod +x` 필요 없음 (`node 파일명` 으로 실행하므로).

## 어떻게 켜지나
`.claude/settings.json` 이 위 스크립트들을 각 이벤트에 연결한다. clone/adopt 하면 이미 연결돼 있다. 추가 설정 없음.

## 왜 중요한가
- **자동 localhost** → "화면 어디서 봐요?" 없이 첫 화면의 성취감.
- **용어 풀이 강제** → 비개발자도 클로드 답을 알아듣는다.
- **handoff + progress** → 오늘 → 집 → 내일 로 안 끊기고 이어진다.

## 안전
- 모든 훅은 **fail-open** — 에러가 나도 작업을 막지 않는다 (항상 exit 0).
- `progress-html.mjs` 는 `.env` 를 절대 읽지 않고, 키 패턴(sk-…, *KEY/SECRET/TOKEN*)을 마스킹한다.

## 고치려면
`.claude/hooks/*.mjs` 를 열어 문구를 바꾼다. 예: `explain-terms.mjs` 의 주입 문장을 내 스타일로.

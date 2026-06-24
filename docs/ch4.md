# CHAPTER 4. MCP Jira 연동 — 티켓 관리를 명령어 하나로

> Jira 열지 않고 Claude Code로 티켓을 만든다

## 🎫 Jira MCP 연동 방법

Jira MCP는 CHAPTER 3에서 설정한 `mcp-atlassian` 서버와 동일합니다. Confluence와 Jira가 하나의 MCP 서버로 함께 연동되므로, **별도 추가 설정 없이 바로 사용 가능**합니다.

:::tip 💡 Jira 연동 전 확인 사항
- `~/.claude.json` 에 `JIRA_URL` 및 `JIRA_PERSONAL_TOKEN` 설정 완료 여부 확인
- `JIRA_SSL_VERIFY: "false"` 설정 여부 확인 (사내망 필수)
- GlobalProtect VPN 연결 상태 확인
- Jira Personal Access Token은 Confluence와 **별도**로 발급 필요
:::

### Jira Personal Access Token 발급

1. Jira 웹(`https://jira.daumkakao.com`) 접속
2. 우측 상단 프로필 → **Profile**
3. 좌측 메뉴 **Personal Access Tokens** → 새 토큰 생성 후 복사
4. `~/.claude.json` 의 `JIRA_PERSONAL_TOKEN` 값에 붙여넣기

## ⚡ 티켓 생성·조회·상태 변경 실전 예시

Jira MCP 연동 후 가장 많이 사용한 기능은 **티켓 생성**과 **상태 변경**입니다. 기존에 Jira UI를 열어 직접 입력하던 작업을 Claude Code 프롬프트 한 줄로 처리할 수 있습니다.

### 티켓 생성

```
KEP 프로젝트에 아래 내용으로 Jira 티켓을 생성해줘.
- 제목: [Analytics] PubSub 연동 API 스펙 검토
- 유형: Task
- 담당자: chloe.sl
- 우선순위: High
- 설명: PubSub 서비스 연동을 위한 API 스펙 검토 및 기획서 작성
```

### 티켓 조회

```
# 내 담당 티켓 조회
나에게 할당된 In Progress 상태의 티켓 목록을 보여줘.

# 특정 이슈 조회
KEP-1234 티켓의 상세 내용과 현재 상태를 알려줘.

# 프로젝트 전체 조회
KEP 프로젝트에서 이번 주 생성된 티켓 목록을 보여줘.
```

### 티켓 상태 변경 및 코멘트 추가

```
# 상태 변경
KEP-1234 티켓 상태를 'In Review'로 변경해줘.

# 코멘트 추가
KEP-1234에 아래 내용으로 코멘트 추가해줘:
"API 스펙 검토 완료. 기획서 초안 작성 시작 예정."
```

## 🔄 기획자가 Jira를 더 잘 쓰게 된 이유

단순히 티켓을 빠르게 만드는 것 이상으로, Claude Code + Jira MCP 조합은 기획자의 **업무 흐름 자체를 바꿨습니다.**

| 상황 | 기존 방식 | Claude Code 방식 |
| --- | --- | --- |
| 회의 후 액션 아이템 등록 | Jira 열고 하나씩 수동 입력 | 회의록 메모 → 티켓 일괄 생성 요청 |
| 스프린트 현황 파악 | Jira 보드 직접 확인 | "이번 스프린트 진행 현황 요약해줘" |
| 티켓 상태 일괄 업데이트 | 티켓마다 개별 클릭 | "완료된 항목 목록을 Done으로 변경해줘" |
| 특정 담당자 티켓 파악 | 필터 설정 후 조회 | "OOO 담당 미완료 티켓 목록 보여줘" |

## ⏱️ 도입 전후 Jira 업무 시간 비교

| 작업 | 도입 전 | 도입 후 | 단축 효과 |
| --- | --- | --- | --- |
| 티켓 생성 (1건) | 약 5분 | 약 30초 | **90% ↓** |
| 액션 아이템 일괄 등록 | 약 20분 | 약 3분 | **85% ↓** |
| 스프린트 현황 파악 | 약 10분 | 약 1분 | **90% ↓** |
| 상태 일괄 업데이트 | 약 15분 | 약 2분 | **87% ↓** |

## 🚨 트러블슈팅 — Atlassian MCP 연결 오류

### Atlassian 상태가 'fail'로 표시될 때

Claude Code → 설정 → 개발자 → Atlassian 상태가 **fail**로 표시된다면 아래 순서로 확인하세요.

:::tip 📌 참고 사항 — MCP fail 상태 원인과 해결

**1단계 — Docker 실행 상태 확인**

Claude Code의 MCP 서버들은 대부분 아래 구조로 동작합니다.
- Docker 기반
- stdio transport 기반
- Claude 실행 시 자동 spawn

Docker가 죽으면 MCP도 함께 `Server disconnected` 형태로 떨어지는 경우가 많습니다.

```bash
# Docker 실행 중인 컨테이너 확인
docker ps

# Docker 데몬이 실행 중인지 확인
docker info
```
:::

| 증상 | 원인 | 해결 방법 |
| --- | --- | --- |
| Atlassian 상태 **fail** | Docker 데몬 미실행 | Docker Desktop 실행 후 Claude Code 재시작 |
| `Server disconnected` | Docker 컨테이너 종료 | Docker 재실행 후 Claude Code 재시작 |
| MCP 응답 없음 | VPN 미연결 | GlobalProtect VPN 연결 후 재시도 |
| 간헐적 연결 끊김 | Docker 메모리 부족 | 불필요한 컨테이너 정리 후 재시작 |

> ⚠️ MCP 설정을 변경한 경우 반드시 **Claude Code를 완전히 종료 후 재시작**해야 새 설정이 반영됩니다. 단순 새로고침으로는 적용되지 않습니다.

Jira와 Confluence는 동일한 `mcp-atlassian` 서버를 공유하므로, Atlassian MCP가 정상 동작하면 두 서비스 모두 함께 사용할 수 있습니다. 다음 **CH.5**에서는 Figma MCP 연동을 통해 기획 화면 시안을 직접 만드는 방법을 다룹니다.

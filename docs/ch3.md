# CHAPTER 3. MCP Confluence 연동 — 문서 업무를 자동화하다

> 회의록·기획서·스펙 문서, 이제 Claude Code가 초안을 잡는다

## 🔧 Confluence MCP 연동 방법

사내 Confluence(`wiki.daumkakao.com`)를 Claude Code에 연동하려면 **Personal Access Token 발급**과 **Docker 기반 MCP 서버 설정** 두 단계가 필요합니다.

### 1단계 — Confluence Personal Access Token 발급

1. Confluence 웹(`https://wiki.daumkakao.com`) 접속
2. 우측 상단 프로필 클릭 → **Settings**
3. **Personal Access Tokens** → 새 토큰 생성 후 복사

> ⚠️ 토큰은 생성 시 한 번만 표시됩니다. 반드시 즉시 복사해두세요. 분실 시 재발급이 필요합니다.

### 2단계 — Docker 이미지 Pull

```bash
docker pull ghcr.io/sooperset/mcp-atlassian:latest
```

### 3단계 — ~/.claude.json 설정

```bash
# 설정 파일 열기
vi ~/.claude.json
```

```json
// mcpServers 항목에 아래 내용 추가
{
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "CONFLUENCE_URL",
        "-e", "CONFLUENCE_PERSONAL_TOKEN",
        "-e", "JIRA_URL",
        "-e", "JIRA_PERSONAL_TOKEN",
        "-e", "JIRA_SSL_VERIFY",
        "-e", "CONFLUENCE_SSL_VERIFY",
        "ghcr.io/sooperset/mcp-atlassian:latest"
      ],
      "env": {
        "CONFLUENCE_URL": "https://wiki.daumkakao.com",
        "CONFLUENCE_PERSONAL_TOKEN": "발급받은_토큰",
        "JIRA_URL": "https://jira.daumkakao.com",
        "JIRA_PERSONAL_TOKEN": "발급받은_토큰",
        "JIRA_SSL_VERIFY": "false",
        "CONFLUENCE_SSL_VERIFY": "false"
      }
    }
  }
}
```

:::warning ⚠️ 사내망 설정 시 반드시 확인할 것
- Docker args의 `-e VARNAME`과 env의 실제 값이 **쌍으로** 존재해야 합니다
- Jira와 Confluence **각각** SSL_VERIFY 설정 필요 (`JIRA_SSL_VERIFY` / `CONFLUENCE_SSL_VERIFY`)
- 사내 내부망은 자체 서명(self-signed) SSL 인증서를 사용하므로 두 값 모두 반드시 `"false"` 로 설정
- **GlobalProtect VPN** 연결 상태에서만 동작합니다
:::

### 4단계 — Claude Code 재시작 및 접근 확인

설정 변경 후 Claude Code를 재시작해야 MCP가 새 설정으로 로드됩니다. 재시작 후 아래와 같이 접근을 테스트합니다.

```
# Claude Code에서 Confluence 접근 테스트 (프롬프트 예시)
"KEPclouddev 스페이스에 접근해서 최근 페이지 목록을 보여줘"
```

## 📝 회의록 자동 생성 실전 예시

Confluence MCP 연동 후 가장 즉각적인 효과를 체감한 것이 바로 **회의록 자동 생성**입니다. 기존에는 회의 후 40분을 들여 정리하던 작업이 10분 이내로 단축됐습니다.

### 실전 워크플로우

| 단계 | 작업 | 방법 |
| --- | --- | --- |
| **1** | 회의 내용 메모 전달 | Claude Code에 회의 메모(텍스트)를 붙여넣기 |
| **2** | 초안 생성 요청 | 회의록 포맷(날짜·참석자·안건·결정사항·액션아이템) 지정 |
| **3** | Confluence 업로드 | 페이지 ID 또는 스페이스 지정하여 자동 생성 |
| **4** | 검토 및 수정 | 생성된 페이지 확인 후 필요 시 추가 수정 요청 |

### 프롬프트 예시

```
아래 회의 메모를 바탕으로 회의록을 작성하고
KEPclouddev 스페이스의 '회의록' 페이지 하위에 새 페이지로 생성해줘.
포맷:
- 일시 / 참석자
- 안건별 논의 내용
- 결정 사항
- 액션 아이템 (담당자 / 기한 포함)
[회의 메모 붙여넣기]
```

## 📄 기획서·스펙 문서 조회·수정 워크플로우

Confluence MCP를 통해 기존 문서를 조회하고, 변경된 내용을 반영하는 작업도 자동화할 수 있습니다.

:::tip ✅ 실제로 활용한 문서 자동화 사례
- 📋 **스펙 문서 업데이트** — "API 응답 필드에 X 항목 추가됐어. 관련 스펙 문서 찾아서 수정해줘"
- 🔍 **문서 검색·요약** — "PubSub 서비스 관련 기획서 찾아서 주요 내용 요약해줘"
- 📑 **신규 기획서 초안** — "Analytics 서비스 신규 기능 기획서 초안을 아래 구조로 작성해줘"
- 🔗 **페이지 하위 구조 생성** — "이 페이지 하위에 챕터별로 페이지를 나눠서 생성해줘"
:::

### 문서 조회 및 수정 프롬프트 예시

```
page ID 123456789 페이지를 가져와서
'오류 코드' 섹션에 아래 항목을 추가해줘:
- 에러코드: E4023
- 의미: 요청 한도 초과
- 조치 방법: 일정 시간 후 재시도
```

## ⏱️ 도입 전후 문서 작업 시간 비교

| 작업 | 도입 전 | 도입 후 | 단축 효과 |
| --- | --- | --- | --- |
| 회의록 정리 및 업로드 | 약 40분 | 약 10분 | **75% ↓** |
| 스펙 문서 수정·배포 | 약 30분 | 약 8분 | **73% ↓** |
| 기획서 초안 작성 | 약 2시간 | 약 30분 | **75% ↓** |
| 문서 검색 및 내용 파악 | 약 20분 | 약 3분 | **85% ↓** |

## 🚨 트러블슈팅 — 연동 중 겪은 실제 오류

사내 Confluence 연동 시 아래 오류들을 실제로 겪었습니다. 동일한 상황이라면 아래 해결 방법을 바로 적용해보세요.

| 오류 메시지 | 원인 | 해결 방법 |
| --- | --- | --- |
| `SSL: CERTIFICATE_VERIFY_FAILED` | CONFLUENCE_SSL_VERIFY 누락 | `~/.claude.json`에 `CONFLUENCE_SSL_VERIFY: "false"` 추가 |
| `401 Authentication failed` | 토큰 만료 또는 오류 | Confluence에서 토큰 재발급 후 교체 |
| 설정 변경이 반영 안 됨 | `claude_desktop_config.json` 만 수정한 경우 | **Claude Code는 `~/.claude.json` 을 사용** — 파일 위치 확인 필수 |
| MCP 서버 연결 안 됨 | VPN 미연결 | GlobalProtect VPN 연결 후 Claude Code 재시작 |
| Docker 실행 오류 | 이미지 미설치 | `docker pull ghcr.io/sooperset/mcp-atlassian:latest` 실행 |

Confluence MCP 연동이 완료되면 Jira도 동일한 MCP 서버(`mcp-atlassian`)로 함께 연동됩니다. **CH.4**에서는 Jira MCP를 활용한 티켓 관리 자동화를 다룹니다.

# CHAPTER 1. 환경 구축 — 기획자도 세팅할 수 있다

> 처음 30분, Claude Code를 내 업무에 연결하다

## 🛠️ Claude Code 설치부터 첫 실행까지

Claude Code는 터미널에서 동작하는 CLI 도구입니다. 설치 자체는 단순하며, Node.js 환경만 갖춰져 있으면 누구나 시작할 수 있습니다.

### 1단계 — 사전 요구사항 확인

| 항목 | 내용 |
| --- | --- |
| **Node.js** | v18 이상 설치 필요 — `node -v` 로 버전 확인 |
| **npm** | Node.js 설치 시 자동 포함 |
| **Anthropic 계정** | claude.ai 계정 및 Claude Code 접근 권한 필요 |
| **터미널** | macOS: 기본 터미널 또는 iTerm2 / Windows: WSL 권장 |

### 2단계 — 설치 및 실행

```bash
# 1. Claude Code 전역 설치
npm install -g @anthropic-ai/claude-code

# 2. 설치 확인
claude --version

# 3. 작업 디렉토리로 이동 후 첫 실행
cd ~/my-project
claude
```

첫 실행 시 Anthropic 계정 인증이 진행됩니다. 브라우저가 자동으로 열리며 로그인 후 터미널로 돌아오면 바로 사용할 수 있습니다.

## 🔌 MCP란 무엇인가 — 기획자 언어로 설명하기

MCP(Model Context Protocol)는 Claude Code가 외부 서비스와 직접 대화할 수 있게 해주는 **연결 표준**입니다. 쉽게 말해, Claude Code에 "Confluence 열쇠", "Jira 열쇠", "Figma 열쇠"를 하나씩 꽂아주는 것과 같습니다.

:::tip 💡 MCP를 기획자 언어로 이해하기
- MCP 없이 Claude Code = 인터넷 없는 스마트폰. 혼자서 할 수 있는 것만 가능
- MCP 연동 후 Claude Code = 모든 업무 도구가 연결된 올인원 업무 허브
- MCP는 각 서비스가 제공하는 **공식 연결 규격**이므로 보안 걱정 없이 사용 가능
:::

## ⚙️ MCP 설정 방법

MCP 서버는 Claude Code의 설정 파일(`~/.claude.json`)에 등록합니다.

### MCP 설정 기본 구조

```json
// MCP 서버 설정 예시 (~/.claude.json)
{
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "CONFLUENCE_URL",
        "-e", "CONFLUENCE_PERSONAL_TOKEN",
        "-e", "CONFLUENCE_SSL_VERIFY",
        "-e", "JIRA_URL",
        "-e", "JIRA_PERSONAL_TOKEN",
        "-e", "JIRA_SSL_VERIFY",
        "ghcr.io/sooperset/mcp-atlassian:latest"
      ],
      "env": {
        "CONFLUENCE_URL": "https://wiki.daumkakao.com",
        "CONFLUENCE_PERSONAL_TOKEN": "발급받은_토큰",
        "CONFLUENCE_SSL_VERIFY": "false",
        "JIRA_URL": "https://jira.daumkakao.com",
        "JIRA_PERSONAL_TOKEN": "발급받은_토큰",
        "JIRA_SSL_VERIFY": "false"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "발급받은_토큰"
      }
    }
  }
}
```

> ⚠️ **사내 Confluence(wiki.daumkakao.com) 연동 시 주의**  
> 사내 내부망은 **자체 서명(self-signed) SSL 인증서**를 사용하기 때문에, MCP 설정 시 `CONFLUENCE_SSL_VERIFY: "false"` 및 `JIRA_SSL_VERIFY: "false"` 를 반드시 추가해야 합니다. 또한 **GlobalProtect VPN** 연결 상태에서만 접근이 가능합니다.  
> → 상세 연동 절차 및 트러블슈팅은 **CH.3**에서 다룹니다.

## 📋 내가 연동한 MCP 목록과 선택 이유

아래는 실제 업무에서 연동하여 활용 중인 MCP 목록입니다. 각 챕터에서 상세 활용법을 다룹니다.

| MCP | 연동 서비스 | 주요 활용 | 관련 챕터 |
| --- | --- | --- | --- |
| **mcp-atlassian** | Confluence + Jira | 문서 생성·수정, 티켓 관리 자동화 | CH.3, CH.4 |
| **mcp-figma** | Figma | 디자인 컴포넌트 참조, 화면 시안 제작 | CH.5 |
| **mcp-github** | GitHub / GitHub Enterprise | 문서 repo clone, PR·이슈 관리 | CH.6 |
| **kakaocloud-docs** | Kakao Cloud Docs | 서비스 공식 문서 검색 및 초안 작성 | CH.6 |

## 🟡 KakaoCloud MCP Hub — 사내 전용 MCP 연결

외부 공개 MCP 외에도, **카카오엔터프라이즈 내부에서 직접 만든 MCP**를 연결할 수 있습니다. **KakaoCloud MCP Hub**는 사내 서비스와 Claude Code를 연결하는 전용 허브로, 사내망에서 접근 가능합니다.

:::tip 🔗 KakaoCloud MCP Hub 접속 정보
- **URL**: https://mcp.kakaocloud.io/
- **접근 조건**: 사내망 또는 SASE VPN 연결 상태에서 접속 가능
- **제공 내용**: 카카오클라우드 서비스 전용 MCP 서버 목록 및 연동 가이드
- **장점**: 사내 인증 체계와 연동되어 별도 토큰 발급 없이 빠르게 연결 가능
:::

### KakaoCloud MCP Hub 연동 예시

```json
// KakaoCloud MCP Hub 설정 예시 (~/.claude.json)
{
  "mcpServers": {
    "kakaocloud-mcp": {
      "type": "url",
      "url": "https://mcp.kakaocloud.io/sse"
    }
  }
}
```

KakaoCloud MCP Hub를 통해 연결한 MCP는 **카카오클라우드 서비스 전용 컨텍스트**를 Claude Code에 제공합니다. 사용자 가이드 작성, 서비스 스펙 조회 등 KC 관련 업무에서 특히 유용합니다. 자세한 활용 사례는 **CH.6**에서 다룹니다.

## ✅ 환경 구축 체크리스트

:::tip 🗒️ 세팅 완료 전 확인 항목
- ☐ Node.js v18 이상 설치 확인
- ☐ `npm install -g @anthropic-ai/claude-code` 완료
- ☐ `claude --version` 으로 설치 확인
- ☐ Anthropic 계정 인증 완료
- ☐ 연동할 MCP 서버 목록 확인 및 토큰 발급
- ☐ MCP 설정 파일(`~/.claude.json`) 작성
- ☐ 사내 Confluence 연동 시 `SSL_VERIFY: false` 및 VPN 연결 확인
- ☐ KakaoCloud MCP Hub(https://mcp.kakaocloud.io/) 접속 확인 (사내망/VPN 필요)
- ☐ `claude` 실행 후 MCP 연결 상태 확인
:::

환경 구축이 완료되면 다음 챕터부터는 바로 실전 활용으로 넘어갑니다. **CH.2**에서는 Claude Code 도입 전후 업무 루틴을 비교하고, 자동화 대상을 어떻게 발굴하는지 살펴봅니다.

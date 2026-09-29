export default {
  base: '/claude-code-planner/',
  title: '기획자의 Claude Code 실무 활용 A to Z',
  description: '비개발자를 위한 AI 업무 자동화 실전 가이드',
  lang: 'ko-KR',
  themeConfig: {
    nav: [
      { text: '홈', link: '/' },
      { text: '가이드', link: '/prologue' }
    ],
    sidebar: [
      { text: '📖 들어가며', link: '/prologue' },
      { text: 'CH.0 기획자에게 Claude Code가 필요한 이유', link: '/ch0' },
      { text: 'CH.1 환경 구축', link: '/ch1' },
      { text: 'CH.2 반복 업무의 종말', link: '/ch2' },
      { text: 'CH.3 MCP Confluence 연동', link: '/ch3' },
      { text: 'CH.4 MCP Jira 연동', link: '/ch4' },
      { text: 'CH.5 MCP Figma 연동', link: '/ch5' },
      { text: 'CH.6 카카오클라우드 사용자 가이드 작성', link: '/ch6' },
      { text: 'CH.7 하네스로 기획 검증 자동화하기', link: '/ch7' },
      { text: 'CH.8 API 자동화 테스트 툴 구축', link: '/ch8' },
      { text: 'CH.9 제안서 작성', link: '/ch9' },
      { text: '🎯 나오며', link: '/epilogue' }
    ],
    footer: {
      message: 'Claude Code로 일하는 기획자',
      copyright: 'Copyright © 2026 Chloe'
    }
  }
}

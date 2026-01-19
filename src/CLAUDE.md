# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

소하천 수위 모니터링 대시보드 - 실시간 수위 데이터를 지도 기반으로 시각화하는 웹 애플리케이션

## Development Commands

### Frontend (frontend/)
```bash
npm run dev      # 개발 서버 실행 (포트 8000)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과물 미리보기
```

### Backend (backend/)
```bash
npm run start:dev   # 개발 서버 (watch 모드)
npm run build       # 빌드
npm run start:prod  # 프로덕션 실행
npm run test        # 단위 테스트
npm run test:e2e    # E2E 테스트
npm run lint        # ESLint + 자동 수정
npm run format      # Prettier 포맷팅
```

## Architecture

### Monorepo Structure
```
src/
├── frontend/    # Vue 3 + Vite + Pinia + Vuetify
├── backend/     # NestJS REST API
└── ../publishing/  # 정적 HTML 퍼블리싱 파일
```

### Frontend Stack
- **Vue 3** Composition API
- **Pinia** 상태관리 (stores/device.js)
- **Vuetify 3** UI 컴포넌트 (다크 모드)
- **Tailwind CSS** + SCSS 스코프드 스타일
- **Chart.js** 차트 라이브러리

### Backend Stack
- **NestJS 11** with TypeScript
- **Jest** 테스트 프레임워크

### Key Data Flow
1. 장비 데이터: `frontend/src/assets/data/devices.js` (정적 데이터)
2. 상태 관리: `frontend/src/stores/device.js` (Pinia store)
3. 수위 판정: `frontend/src/utils/waterLevel.js` (70%/80%/90% 기준)

### Routes
- `/` → MainPage (지도 기반 대시보드)
- `/detail/:id` → DetailPage (장비 상세정보)

## Code Conventions

### Vuetify Theme Colors
```javascript
ok: '#27c46b'      // 정상
caution: '#f7c948' // 주의 (70%)
warn: '#ff9f1a'    // 경계 (80%)
crit: '#ff4d4f'    // 심각 (90%)
unk: '#9aa7b7'     // 알수없음
```

### Water Level Thresholds
- `lv70`: 주의 수위 (CAUTION)
- `lv80`: 경계 수위 (WARN)
- `lv90`: 심각 수위 (CRIT)

### API Proxy
개발 환경에서 `/api/*` 요청은 `http://localhost:8080`으로 프록시됨

## Current State

- 메인 페이지: 이미지 지도 기반 마커 표시, 실시간 시뮬레이션 동작
- 상세 페이지 컴포넌트들: `frontend/src/components/detail/` 내 파일들은 대부분 미구현 (빈 파일)
- 백엔드 API: 기본 구조만 존재, 실제 API 엔드포인트 미구현

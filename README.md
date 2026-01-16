# sriver

** WEB 접속 주소 **

```bash
http://www.woobo.online:8000
```

** WEB 실행 **

1. 의존성 설치
```bash
npm install
```

2. front-end 서버 실행
```bash
npm run dev
```

3. back-end 서버 실행
```bash
npm run dev
```

** 프로젝트 구조 **
```
src/
├── assets/             # 정적 리소스
│   ├── styles/         # CSS 파일 ( main-style.css, detail.css )
│   ├── img/            # 이미지 파일( logo-sangju.png )
│   └── data/           # 지점별 데이터 ( devices.js )  <- Back-end에서 DB 동기화 필요
├── components/         # Vue 컴포넌트
│   ├── main/           # main 레이아웃 컴포넌트
│   └── detail/         # detail 레이아웃 컴포넌트
├── pages/              # 페이지 뷰
│   ├── MainPage.vue    # 메인 페이지
│   ├── DetailPage.vue  # 상세 페이지
│   └── ReportView.vue  # 보고서 페이지
├── utils/              # 유틸리티 함수
├── router/             # 라우터 설정
└── App.vue             # 루트 컴포넌트
```
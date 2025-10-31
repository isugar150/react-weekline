# react-weekline

[![npm version](https://img.shields.io/npm/v/react-weekline.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/react-weekline)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)
[![Built with React](https://img.shields.io/badge/built%20with-React-61DAFB.svg?style=flat-square&logo=react&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/typescript-007ACC?style=flat-square&logo=typescript&logoColor=white)]()


**React용 가볍고 유연한 주간 캘린더 컴포넌트.**  
요일 헤더와 일자별 콘텐츠 영역이 포함된 7일 리스트 뷰를 렌더링합니다.

<img width="459" height="644" alt="스크린샷 2025-10-21 145905" src="https://github.com/user-attachments/assets/1f592262-46a5-41d5-ba55-79c3645860c0" />

## ✨ 주요 특징

- 요일 헤더 + 일자 콘텐츠 영역으로 구성된 주간 리스트 레이아웃  
- `renderDayContent(date)`를 통한 일자별 커스텀 렌더러 지원  
- 이전/다음 주로 이동 가능  
- 주 시작 요일 설정 가능 (일요일 or 월요일)  
- 비어 있는 날짜 숨김 옵션 (`showEmptyDays`)  
- 최소한의 CSS로 쉽게 테마 변경 가능  

## 📦 설치
- npm: `npm i react-weekline`
- pnpm: `pnpm add react-weekline`
- yarn: `yarn add react-weekline`

🔗 Peer Dependencies
- `react`: ^18 || ^19
- `react-dom`: ^18 || ^19

🧩 최소 요구사항
- Node.js 18 이상 (Vite 7 등 최신 번들러 필요)
- ESM을 지원하는 최신 번들러 (Vite, Webpack 5, Rspack 등)
- TypeScript는 선택사항 (타입 정의 포함됨)

🎨 스타일 적용
- 앱 진입점에서 한 번만 CSS 임포트:
  - `import 'react-weekline/style.css'`
- 필요 시 CSS 클래스명을 오버라이드하여 테마 커스터마이징 가능.

🚀 빠른 시작 예제

## 사용 방법
- CSS: `import "react-weekline/style.css"`
- 컴포넌트: `import WeekCalendar, { type WeekStart } from "react-weekline/WeekCalendar"`

```tsx
import { useMemo, type JSX } from "react";
import "react-weekline/style.css";
import WeekCalendar, { type WeekStart } from "react-weekline/WeekCalendar";

type Item = { id: string | number; time: string; title: string };

const startOfWeek: WeekStart = "sun";

export default function Example(): JSX.Element {
  const items: Item[] = useMemo(() => [
    { id: 1, time: "2025-10-21 10:00:00", title: "Quarterly Planning" },
  ], []);

  const parseLocal = (text: string) => {
    const [datePart, timePart = "00:00:00"] = text.split(" ");
    const [y, m, d] = datePart.split("-").map((n) => parseInt(n, 10));
    const [hh, mm, ss = "0"] = timePart.split(":");
    return new Date(y, (m||1)-1, d||1, parseInt(hh||"0",10), parseInt(mm||"0",10), parseInt(ss||"0",10));
  };

  const renderDayContent = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const dayItems = items.filter((it) => {
      const t = parseLocal(it.time);
      return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
    });

    if (dayItems.length === 0) return null; // or your <EmptyState />

    return (
      <div style={{ display: "grid", gap: 8 }}>
        {dayItems.map((it) => (
          <div key={it.id}>{it.title}</div>
        ))}
      </div>
    );
  };

  return (
    <WeekCalendar
      startOfWeek={startOfWeek}
      onDateClick={(d) => console.log("date click", d.toDateString())}
      renderDayContent={renderDayContent}
      // hide empty days if you prefer:
      // showEmptyDays={false}
    />
  );
}
```

⚙️ API

- `WeekCalendar` props:
  - `leftHeader?: ReactNode`
    - 헤더 왼쪽 영역의 커스텀 엘리먼트
  - `rightHeader?: ReactNode`
    - 헤더 오른쪽 영역의 커스텀 엘리먼트
  - `initialDate?: Date`
    - 초기 주(anchor date), 기본값은 오늘
  - `anchorDateProp?: Date`
    - 직접 컨트롤하기 위한 날짜
  - `onAnchorDateChange?: (date: Date) => {}`
    - 날짜 props 변경 콜백
  - `renderDayContent?: (date: Date) => React.ReactNode`
    - 각 날짜별 렌더링 콜백, null/undefined면 비어 있는 날짜로 처리
  - `startOfWeek?: 'sun' | 'mon'` (default: `'sun'`)
    - 주 시작 요일 (기본값 'sun')
  - `onWeekChange?: (start: Date, end: Date) => void`
    - 주간 변경 시 호출됨
  - `onDateClick?: (date: Date) => void`
    - 날짜 클릭 시 호출됨
  - `showEmptyDays?: boolean` (default: `true`)
    - false면 renderDayContent가 비어 있는 날짜는 렌더링하지 않음 (기본값 true)
  - `scrollToDateOnClick?: boolean` (default: `true`)
    - 날짜 클릭시 해당 날짜로 스크롤

🪶 비어 있는 상태(Empty State) 처리
- `renderDayContent`에서 반환값으로 직접 제어 가능
  - `null` 또는 `undefined` → 비어 있는 날로 간주
  - `showEmptyDays={true}` → 자리만 표시됨 (플레이스홀더 표시 가능)
  - `showEmptyDays={false}` → 해당 날짜 행 자체를 숨김
  - `emptyWeekData?: ReactNode`
    - 해당 주의 모든 날짜가 비어 있을 때 주간 전체에 대한 커스텀 빈 상태를 표시

Data Binding Example (from JSON)

```tsx
import data from './assets/data.json';

type Item = { id: number | string; time: string; title: string; };

const parseLocal = (text: string) => {
  const [datePart, timePart = '00:00:00'] = text.split(' ');
  const [y, m, d] = datePart.split('-').map((n) => parseInt(n, 10));
  const [hh, mm, ss = '0'] = timePart.split(':');
  return new Date(y, (m||1)-1, d||1, parseInt(hh||'0',10), parseInt(mm||'0',10), parseInt(ss||'0',10));
};

const renderDayContent = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const items = (data as Item[]).filter((it) => {
    const t = parseLocal(it.time);
    return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
  });
  if (items.length === 0) return null;
  return (
    <ul>
      {items.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
};
```

🧠 TypeScript
- 타입 정의 파일 포함되어 있음
- JSON 직접 import 시, 프로젝트가 이를 지원해야 함
  - Vite에서는 기본적으로 지원됨
  - 엄격한 TS 설정에서는 아래 선언이 필요할 수 있음:
    - `declare module '*.json' { const value: any; export default value; }`

🌐 SSR 지원  
-- 브라우저 전용 전역 객체를 사용하지 않음  
-- React 18/19 기반의 SSR 환경에서 정상 동작 가능  

🧑‍💻 로컬 개발 (기여자용)
- 종속성 설치: `npm i`
- 개발 시작: `npm run dev`
- 빌드: `npm run build`
- 유효성 검사: `npm run lint`

📌 참고
- 이 라이브러리는 레이아웃 및 네비게이션에 집중
- 데이터 로딩, 필터링, 빈 상태 표현 등은 모두 사용자가 `renderDayContent로` 제어


## CSS 클래스 가이드

아래 클래스와 CSS 변수로 스타일을 간단히 커스터마이즈할 수 있습니다. 필요 시 프로젝트의 전역 CSS에서 동일한 선택자를 사용해 덮어쓰세요.

### CSS 변수 (루트 컨테이너)
- `.wk-wrapper` 내 정의 변수
  - `--wk-border`: 경계/디바이더 색상
  - `--wk-text`: 기본 텍스트 색상
  - `--wk-muted`: 보조 텍스트 색상(라벨 등)
  - `--wk-sun`: 일요일 색상(빨강 톤)
  - `--wk-sat`: 토요일 색상(파랑 톤)
  - `--wk-today-text`: 오늘 날짜 텍스트 색상
  - `--wk-today-bg`: 오늘 날짜 배경 색상

예시(프로젝트 전역 CSS에서 변수만 교체):

```css
.wk-wrapper {
  --wk-border: #e5e7eb;
  --wk-text: #111827;
  --wk-muted: #6b7280;
  --wk-sun: #ef4444;
  --wk-sat: #3b82f6;
  --wk-today-text: #111827;
  --wk-today-bg: #e5e7eb;
}
```

### 레이아웃/헤더
- `.wk-wrapper`: 컴포넌트 루트, 컬럼 레이아웃과 기본 폰트/색 적용
- `.wk-header`: 3열 그리드(좌/중앙/우) 헤더 컨테이너
- `.wk-header-side`: 좌/우 헤더 영역의 공통 영역 박스
- `.wk-left`, `.wk-right`: 좌/우 정렬 보조 유틸리티
- `.wk-header-center`: 중앙 헤더(이동 버튼 + 년월 텍스트) 정렬 컨테이너
- `.wk-nav-btn`: 이전/다음 주 이동 버튼(호버 시 배경 하이라이트)
- `.wk-year-month`: 중앙의 `YYYY.MM` 년월 텍스트(볼드)

### 요일/날짜 바(상단 가이드)
- `.wk-weekbar`: 7열 그리드(일~토 또는 월~일) 컨테이너
- `.wk-weekbar-col`: 라벨/날짜 2행 그리드, 중앙 정렬
- `.wk-weekbar-label`: 요일 라벨 텍스트(작고 muted 색상)
- `.wk-weekbar-date`: 날짜 원형 배지(오늘/주말 상태에 따라 색/배경 변경)
- `.wk-sun`, `.wk-sat`: 일/토 강조(라벨/날짜에 주말 색 적용)
- `.wk-weekbar-date.wk-today`: 오늘 날짜 하이라이트(배경/텍스트 변수 사용)
- `.wk-clickable`: 클릭 가능 상태(포인터 커서/호버 밝기)

### 주간 리스트(실제 컨텐츠 영역)
- `.wk-weeklist`: 세로 스택(각 날짜별 행)
- `.wk-weeklist-row`: 날짜 1행 + 컨텐츠 1행 구성의 그리드
- `.wk-weeklist-date-row`: 날짜 텍스트와 우측 가로 디바이더를 담는 행
- `.wk-weeklist-date-text`: `YYYY.MM.DD (요일)` 포맷 텍스트
- `.wk-divider`: 날짜 행의 가로 줄(좌측 텍스트 이후 전체 채움)
- `.wk-weeklist-content`: 날짜별 컨텐츠 컨테이너(최소 높이/모서리 라운드)
- `.wk-dashes`: 점선/흐린 요소에 사용할 수 있는 보조 색상(필요 시 사용)

### 셀렉터 예시(부분 오버라이드)
```css
/* 이동 버튼 스타일 조정 */
.wk-nav-btn {
  border-radius: 8px;
  border-color: #d1d5db;
}

/* 요일 라벨 크기/색 조정 */
.wk-weekbar-label {
  font-size: 13px;
  color: #9ca3af;
}

/* 오늘 날짜 배지 강조 */
.wk-weekbar-date.wk-today {
  background: #dbeafe;
  color: #1e3a8a;
}

/* 날짜별 컨텐츠 패딩/테두리 추가 */
.wk-weeklist-content {
  padding: 10px;
  border: 1px dashed var(--wk-border);
}

/* 주말 색상 커스텀 */
.wk-weekbar-label.wk-sun, .wk-weekbar-date.wk-sun { color: #ef4444; }
.wk-weekbar-label.wk-sat, .wk-weekbar-date.wk-sat { color: #3b82f6; }
```

### CSS 파일 위치 안내
- 배포 번들: `react-weekline/style.css` (패키지 설치 후 import)
- 소스 참고용: `src/components/WeekCalendar.css`
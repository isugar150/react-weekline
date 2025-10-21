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
```tsx
import { useMemo } from 'react';
import { WeekCalendar, type WeekStart } from 'react-weekline';
import 'react-weekline/style.css';

type Item = { id: string | number; time: string; title: string };

const startOfWeek: WeekStart = 'sun';

export default function Example() {
  const items: Item[] = useMemo(() => [
    { id: 1, time: '2025-10-21 10:00:00', title: 'Quarterly Planning' },
  ], []);

  const renderDayContent = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const sameDay = (s: string) => {
      // Parse as local time (YYYY-MM-DD HH:mm:ss)
      const [datePart, timePart = '00:00:00'] = s.split(' ');
      const [yy, mm, dd] = datePart.split('-').map((n) => parseInt(n, 10));
      const [hh, mi, ss = '0'] = timePart.split(':');
      const dt = new Date(yy, (mm || 1) - 1, dd || 1, parseInt(hh||'0',10), parseInt(mi||'0',10), parseInt(ss||'0',10));
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
    };

    const dayItems = items.filter((it) => sameDay(it.time));
    if (dayItems.length === 0) return null; // return null to signal an empty day

    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {dayItems.map((it) => (
          <div key={it.id}>{it.title}</div>
        ))}
      </div>
    );
  };

  return (
    <WeekCalendar
      startOfWeek={startOfWeek}
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

🪶 비어 있는 상태(Empty State) 처리
- `renderDayContent`에서 반환값으로 직접 제어 가능
  - `null` 또는 `undefined` → 비어 있는 날로 간주
  - `showEmptyDays={true}` → 자리만 표시됨 (플레이스홀더 표시 가능)
  - `showEmptyDays={false}` → 해당 날짜 행 자체를 숨김

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

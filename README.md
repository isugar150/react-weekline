# react-weekline

[![npm version](https://img.shields.io/npm/v/react-weekline.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/react-weekline)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)
[![Built with React](https://img.shields.io/badge/built%20with-React-61DAFB.svg?style=flat-square&logo=react&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/typescript-007ACC?style=flat-square&logo=typescript&logoColor=white)]()

 
 ## react-weekline

Lightweight, flexible weekly calendar component for React. Renders a 7‑day list view with headers, day labels, and per‑day custom content.

<img width="459" height="644" alt="스크린샷 2025-10-21 145905" src="https://github.com/user-attachments/assets/1f592262-46a5-41d5-ba55-79c3645860c0" />

Features
- Weekly list layout with day header + content region per day
- Custom renderer per day via `renderDayContent(date)`
- Navigation between weeks (prev/next)
- Configurable start of week: Sunday or Monday
- Optional hiding of empty days via `showEmptyDays`
- Minimal CSS, easy to theme

Installation
- npm: `npm i react-weekline`
- pnpm: `pnpm add react-weekline`
- yarn: `yarn add react-weekline`

Peer Dependencies
- `react`: ^18 || ^19
- `react-dom`: ^18 || ^19

Minimum Requirements
- Node.js 18+ (Vite 7 and modern bundlers require Node 18+)
- A modern bundler that supports ESM (Vite, Webpack 5, Rspack, etc.)
- TypeScript optional but recommended (library ships with types)

Styling
- Import the packaged stylesheet once in your app entry:
  - `import 'react-weekline/style.css'`
- You can override classes in your app’s CSS if you need custom theming.

Quick Start

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

API

- `WeekCalendar` props:
  - `leftHeader?: ReactNode`
    - Custom element on the left side of the header bar.
  - `rightHeader?: ReactNode`
    - Custom element on the right side of the header bar.
  - `initialDate?: Date`
    - Anchor date for the initial week. Defaults to “today”.
  - `renderDayContent?: (date: Date) => React.ReactNode`
    - Called for each day of the current week. Return your custom content.
    - Return `null` or `undefined` to indicate an empty day.
  - `startOfWeek?: 'sun' | 'mon'` (default: `'sun'`)
    - Controls whether weeks start on Sunday or Monday.
  - `onWeekChange?: (start: Date, end: Date) => void`
    - Notified whenever the visible week range changes.
  - `onDateClick?: (date: Date) => void`
    - Called when the user clicks a date in the calendar.
  - `showEmptyDays?: boolean` (default: `true`)
    - When `false`, days where `renderDayContent` returns `null`/`undefined` are not rendered in the list.

Empty-State and Empty Days
- You fully control empty-state UI by what you return from `renderDayContent`.
  - Return `null` or `undefined` to mark a day as empty.
  - With `showEmptyDays={true}` (default), the day renders and you can show your own placeholder.
  - With `showEmptyDays={false}`, the day row is hidden entirely when `renderDayContent` is empty.

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

TypeScript
- The package includes type definitions.
- If you import JSON directly (like `import data from './data.json'`), ensure your tooling supports JSON imports.
  - In Vite projects this works out of the box.
  - If you need ambient JSON typing in strict TS setups, you can add a `*.d.ts` with:
    - `declare module '*.json' { const value: any; export default value; }`

SSR
- The component is UI‑only and does not use browser‑only globals during render. It should work with common SSR setups that support React 18/19.

Local Development (for contributors)
- Install deps: `npm i`
- Start dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

Notes
- This library focuses on layout and navigation. Data fetching, filtering, and empty‑state presentation are left to the consumer via `renderDayContent`.

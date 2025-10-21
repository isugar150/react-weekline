import type { JSX } from 'react';
import './App.css';
import WeekCalendar from './components/WeekCalendar';

interface EventItem { id: string; title: string; time?: string }

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((stripTime(a).getTime() - stripTime(b).getTime()) / msPerDay);
}

function EmptyState(): JSX.Element {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: 16, color: '#6b7280' }}>
      <div style={{ display: 'grid', placeItems: 'center', gap: 8 }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l7 4-7 4-7-4 7-4z" stroke="#94a3b8" strokeWidth="1.5" fill="#e5e7eb"/>
          <path d="M19 6v8l-7 4-7-4V6" stroke="#94a3b8" strokeWidth="1.5" fill="#f1f5f9"/>
          <path d="M12 10v8" stroke="#94a3b8" strokeWidth="1.5"/>
        </svg>
        <div style={{ fontSize: 14 }}>표시할 컨텐츠가 없습니다</div>
      </div>
    </div>
  );
}

function EventItemView({ item, onClick }: { item: EventItem; onClick: (it: EventItem) => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      style={{
        width: '100%',
        textAlign: 'left',
        border: '1px solid #e6e8ef',
        borderRadius: 8,
        padding: '8px 10px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
      }}
    >
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: 9999, background: '#6366f1' }} />
      {item.time && <span style={{ fontSize: 12, color: '#6b7280', minWidth: 44 }}>{item.time}</span>}
      <span style={{ fontSize: 14, color: '#2b2f38' }}>{item.title}</span>
    </button>
  );
}

function App(): JSX.Element {
  const handleEventClick = (it: EventItem, date: Date) => {
    console.log('event click:', it, date.toISOString());
  };

  const handleWeekChange = (start: Date, end: Date) => {
    console.log('week change:', start.toDateString(), '→', end.toDateString());
  };

  const handleDateClick = (date: Date) => {
    console.log('date click:', date.toDateString());
  };

  const today = new Date();

  return (
    <div style={{ maxWidth: 860, margin: '24px auto', padding: '0 16px' }}>
      <WeekCalendar
        startOfWeek="sun"
        leftHeader={<div>왼쪽 커스텀</div>}
        rightHeader={<button style={{ padding: '6px 10px' }}>오른쪽 버튼</button>}
        onWeekChange={handleWeekChange}
        onDateClick={handleDateClick}
        renderDayContent={(date: Date) => {
          const diff = daysBetween(date, today); // 양수: date가 과거, 음수: 미래
          let items: EventItem[] = [];

          // 규칙
          // 어제: 2개, 오늘: 1개, 2일 뒤: 3개
          if (diff === 1) {
            items = [
              { id: 'y-1', title: '어제 업무 정리', time: '10:00' },
              { id: 'y-2', title: '어제 미팅 회의록', time: '16:00' },
            ];
          } else if (diff === 0) {
            items = [{ id: 't-1', title: '오늘 일정 확인', time: '09:30' }];
          } else if (diff === -2) {
            items = [
              { id: 'd2-1', title: '디자인 리뷰', time: '09:30' },
              { id: 'd2-2', title: '개발 스탠드업', time: '13:00' },
              { id: 'd2-3', title: 'QA 체크', time: '16:30' },
            ];
          }

          // 다음 주: 없거나(0) / 1개 / 2개
          // 기준: 오늘로부터 7~13일 사이
          if (diff <= -7 && diff >= -13) {
            const mod3 = Math.abs(diff) % 3;
            if (mod3 === 0) {
              items = [];
            } else if (mod3 === 1) {
              items = [{ id: `n1-${diff}`, title: '다음주 일정(임시)', time: '11:00' }];
            } else {
              items = [
                { id: `n2-${diff}-a`, title: '다음주 미팅', time: '10:30' },
                { id: `n2-${diff}-b`, title: '다음주 작업', time: '15:00' },
              ];
            }
          }

          if (items.length === 0) return <EmptyState />;
          return (
            <div style={{ display: 'grid', gap: 8 }}>
              {items.map((it) => (
                <EventItemView key={it.id} item={it} onClick={(e) => handleEventClick(e, date)} />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}

export default App;

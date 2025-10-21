import type { JSX } from 'react';
import './App.css';
import WeekCalendar from './components/WeekCalendar';

function App(): JSX.Element {
  return (
    <div style={{ maxWidth: 860, margin: '24px auto', padding: '0 16px' }}>
      <WeekCalendar
        leftHeader={<div>왼쪽 커스텀</div>}
        rightHeader={<div>오른쪽 커스텀</div>}
        startOfWeek={'sun'}
        renderDayContent={(_date: Date) => (
          <div>
            렌더링할 html 코드
          </div>
        )}
      />
    </div>
  );
}

export default App;

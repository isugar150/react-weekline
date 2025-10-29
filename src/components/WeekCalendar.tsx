import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./WeekCalendar.css";

export type WeekStart = "sun" | "mon";

export type WeekCalendarProps = {
  leftHeader?: ReactNode;
  rightHeader?: ReactNode;
  initialDate?: Date; // anchor date for the week
  renderDayContent?: (date: Date) => ReactNode;
  startOfWeek?: WeekStart; // 'sun' | 'mon' (default: 'sun')
  onWeekChange?: (start: Date, end: Date) => void;
  onDateClick?: (date: Date) => void;
  showEmptyDays?: boolean; // when false, hide rows where renderDayContent returns null/undefined
  emptyWeekData?: ReactNode; // shown when all days are empty for the week
  anchorDateProp?: Date;
  onAnchorDateChange?: (date: Date) => void;
};

// Helpers
const KOREAN_DAYS_SUN_FIRST = ["일", "월", "화", "수", "목", "금", "토"];
const KOREAN_DAYS_MON_FIRST = ["월", "화", "수", "목", "금", "토", "일"];

function getWeekStart(date: Date, start: WeekStart): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) .. 6 (Sat)
  const diff = start === "mon" ? (day + 6) % 7 : day; // mon: Sun->6, Mon->0; sun: Sun->0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatYearMonth(date: Date): string {
  return date.getFullYear() + "." + pad(date.getMonth() + 1);
}

function formatFull(date: Date): string {
  const yoil = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return (
    date.getFullYear() +
    "." +
    pad(date.getMonth() + 1) +
    "." +
    pad(date.getDate()) +
    " (" +
    yoil +
    ")"
  );
}

const ChevronLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function WeekCalendar({
  leftHeader,
  rightHeader,
  initialDate,
  renderDayContent,
  startOfWeek = "sun",
  onWeekChange,
  onDateClick,
  showEmptyDays = true,
  emptyWeekData,
  anchorDateProp,
  onAnchorDateChange,
}: WeekCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const isControlled = anchorDateProp !== undefined;
  const [internalAnchorDate, setInternalAnchorDate] = useState<Date>(
    anchorDateProp
      ? new Date(anchorDateProp)
      : initialDate
        ? new Date(initialDate)
        : today,
  );

  const anchorDate = isControlled
    ? new Date(anchorDateProp!)
    : internalAnchorDate;

  const setAnchorDateSafe = (date: Date) => {
    if (isControlled) {
      onAnchorDateChange?.(date);
    } else {
      setInternalAnchorDate(date);
    }
  };

  const weekStart = useMemo(
    () => getWeekStart(anchorDate, startOfWeek),
    [anchorDate, startOfWeek],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const labels =
    startOfWeek === "mon" ? KOREAN_DAYS_MON_FIRST : KOREAN_DAYS_SUN_FIRST;
  const sundayIndex = startOfWeek === "sun" ? 0 : 6;
  const saturdayIndex = startOfWeek === "sun" ? 6 : 5;

  // Choose display month using the middle day of the week to avoid week-spanning ambiguity
  const midOfWeek = weekDays[3];
  const ym = formatYearMonth(midOfWeek);

  // precompute weekEnd to keep effect deps simple
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const onWeekChangeRef = useRef(onWeekChange);
  useEffect(() => {
    onWeekChangeRef.current = onWeekChange;
  }, [onWeekChange]);

  // notify week change once range changes
  useEffect(() => {
    onWeekChangeRef.current?.(weekStart, weekEnd);
  }, [weekStart, weekEnd]);

  const onPrev = () => setAnchorDateSafe(addDays(anchorDate, -7));
  const onNext = () => setAnchorDateSafe(addDays(anchorDate, 7));

  return (
    <div className="wk-wrapper">
      <div className="wk-header">
        <div className="wk-header-side wk-left">{leftHeader}</div>
        <div className="wk-header-center">
          <button className="wk-nav-btn" aria-label="이전 주" onClick={onPrev}>
            <ChevronLeft />
          </button>
          <span className="wk-year-month">{ym}</span>
          <button className="wk-nav-btn" aria-label="다음 주" onClick={onNext}>
            <ChevronRight />
          </button>
        </div>
        <div className="wk-header-side wk-right">{rightHeader}</div>
      </div>

      <div className="wk-weekbar">
        {labels.map((label, idx) => {
          const isSun = idx === sundayIndex;
          const isSat = idx === saturdayIndex;
          const classes =
            "wk-weekbar-col " + (isSat ? "wk-sat" : isSun ? "wk-sun" : "");
          const dateClasses =
            "wk-weekbar-date " +
            (isSameDay(weekDays[idx], today) ? "wk-today " : "") +
            (isSat ? "wk-sat" : isSun ? " wk-sun" : "");
          return (
            <div key={label} className={classes}>
              <div className="wk-weekbar-label">{label}</div>
              <div
                className={dateClasses + (onDateClick ? " wk-clickable" : "")}
                onClick={() => onDateClick?.(weekDays[idx])}
                role="button"
                tabIndex={0}
                aria-label="날짜 선택"
              >
                {weekDays[idx].getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wk-weeklist">
        {(() => {
          const items = weekDays.map((d) => ({
            date: d,
            content: renderDayContent ? (
              renderDayContent(d)
            ) : (
              <div>�������� html �ڵ�</div>
            ),
          }));

          // Determine if the entire week has no content (only applies when renderDayContent is provided)
          const isAllEmpty =
            !!renderDayContent &&
            items.every(
              (it) => it.content === null || it.content === undefined,
            );

          if (isAllEmpty && emptyWeekData) {
            return <div className="wk-weeklist-empty">{emptyWeekData}</div>;
          }

          return items.map(({ date: d, content }) => {
            if (
              !showEmptyDays &&
              renderDayContent &&
              (content === null || content === undefined)
            ) {
              return null;
            }
            return (
              <div key={d.toISOString()} className="wk-weeklist-row">
                <div
                  className="wk-weeklist-date-row"
                  onClick={() => onDateClick?.(d)}
                >
                  <div className="wk-weeklist-date-text">{formatFull(d)}</div>
                  <div className="wk-divider" aria-hidden="true"></div>
                </div>
                <div className="wk-weeklist-content">{content ?? null}</div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}

import { useMemo, type JSX, useState, useEffect } from "react";
import "./App.css";
import WeekCalendar from "./components/WeekCalendar";
import sampleData from "./assets/data.json";
import { customEmpty as customEmptyRenderer } from "./WeekCalenderEmpty";

interface EventItem {
  id: string | number;
  time: string; // YYYY-MM-DD HH:mm:ss
  title: string;
  content: string;
  photo: string;
  labelColor: string;
  labelName: string;
  tags?: string[];
}

function parseLocalDateTime(text: string): Date {
  const [datePart, timePart = "00:00:00"] = text.split(" ");
  const [y, m, d] = datePart.split("-").map((n) => parseInt(n, 10));
  const [hh, mm, ss = "0"] = timePart.split(":");
  return new Date(
    y,
    (m || 1) - 1,
    d || 1,
    parseInt(hh || "0", 10),
    parseInt(mm || "0", 10),
    parseInt(ss || "0", 10),
  );
}

function EmptyState(): JSX.Element {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: 16,
        color: "#6b7280",
        border: "1px dashed #e6e8ef",
        borderRadius: 8,
      }}
    >
      <div style={{ display: "grid", placeItems: "center", gap: 8 }}>
        No content
      </div>
    </div>
  );
}

function EventItemView({
  item,
  onClick,
}: {
  item: EventItem;
  onClick: (it: EventItem) => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      style={{
        width: "100%",
        textAlign: "left",
        border: "1px solid #e6e8ef",
        borderRadius: 8,
        padding: 8,
        background: "#fff",
        display: "flex",
        alignItems: "stretch",
        gap: 10,
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          alignSelf: "stretch",
          borderRadius: 4,
          background: item.labelColor,
        }}
      />

      <img
        src={item.photo}
        alt={item.title}
        style={{
          width: 64,
          height: 64,
          borderRadius: 6,
          objectFit: "cover",
          flex: "0 0 auto",
          background: "#f3f4f6",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          minWidth: 0,
          flex: 1,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}
        >
          <span
            style={{
              fontSize: 14,
              color: "#111827",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#1f2937",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              padding: "2px 6px",
              borderRadius: 999,
              lineHeight: 1.2,
            }}
          >
            {item.labelName}
          </span>
          {item.tags?.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                color: "#374151",
                background: "#eef2ff",
                border: "1px solid #e0e7ff",
                padding: "2px 6px",
                borderRadius: 999,
                lineHeight: 1.2,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#4b5563",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.content}
        </div>
      </div>
    </button>
  );
}

function App(): JSX.Element {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const startOfWeek = "sun" as const;
  const showEmptyDays = false;

  const handleEventClick = (it: EventItem, date: Date) => {
    console.log("event click:", it, date.toISOString());
  };

  const handleDateClick = (date: Date) => {
    console.log("date click:", date.toDateString());
  };

  const data: EventItem[] = useMemo(() => {
    return (sampleData as unknown as EventItem[]).map((it) => ({ ...it }));
  }, []);

  useEffect(() => {
    console.log(anchorDate);
  }, [anchorDate]);

  return (
    <div style={{ maxWidth: 860, margin: "24px auto", padding: "0 16px" }}>
      <WeekCalendar
        emptyWeekData={<div>There is no schedule.</div>}
        showEmptyDays={showEmptyDays}
        // initialDate={new Date(2025, 9, 21)}
        anchorDateProp={anchorDate}
        onAnchorDateChange={(date) => {
          setAnchorDate(date);
        }}
        startOfWeek={startOfWeek}
        leftHeader={
          <div>
            <button
              onClick={() => {
                setAnchorDate(new Date());
              }}
            >
              오늘
            </button>
          </div>
        }
        rightHeader={<div>Right</div>}
        onDateClick={handleDateClick}
        renderDayContent={(date: Date) => {
          const winEmpty = (
            globalThis as unknown as {
              weeklineEmpty?: (d: Date) => JSX.Element;
            }
          )?.weeklineEmpty;
          const renderEmpty = (customEmptyRenderer ??
            winEmpty ??
            (() => <EmptyState />)) as (d: Date) => JSX.Element;
          const y = date.getFullYear();
          const m = date.getMonth();
          const d = date.getDate();

          const items: EventItem[] = data.filter((it) => {
            const t = parseLocalDateTime(it.time);
            return (
              t.getFullYear() === y && t.getMonth() === m && t.getDate() === d
            );
          });

          if (items.length === 0)
            return showEmptyDays ? renderEmpty(date) : null;
          return (
            <div style={{ display: "grid", gap: 8 }}>
              {items.map((it) => (
                <EventItemView
                  key={it.id}
                  item={it}
                  onClick={(e) => handleEventClick(e, date)}
                />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}

export default App;

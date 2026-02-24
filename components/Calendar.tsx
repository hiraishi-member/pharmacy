'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayCell } from '@/components/DayCell';
import { DailyRecord, Medicine } from '@/lib/types';

interface CalendarProps {
  records: DailyRecord[];
  medicines: Medicine[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayClick: (date: string) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay(); // 0=Sun

  const days: Date[] = [];

  // 前月の埋め
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // 当月
  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDate; d++) {
    days.push(new Date(year, month, d));
  }

  // 次月の埋め（6行 = 42セルに合わせる）
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push(new Date(year, month + 1, d));
  }

  return days;
}

export function Calendar({
  records,
  medicines,
  currentMonth,
  onMonthChange,
  onDayClick,
}: CalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getCalendarDays(year, month);

  const todayKey = toDateKey(new Date());
  const totalExpected = medicines.reduce((sum, m) => sum + m.timings.length, 0);

  const monthLabel = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
  }).format(currentMonth);

  const goPrev = () => onMonthChange(new Date(year, month - 1, 1));
  const goNext = () => onMonthChange(new Date(year, month + 1, 1));

  return (
    <div>
      {/* ヘッダー: 前月 / 月表示 / 翌月 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goPrev} aria-label="前月">
          <ChevronLeft className="size-5" />
        </Button>
        <h2 className="text-sm font-semibold">{monthLabel}</h2>
        <Button variant="ghost" size="icon" onClick={goNext} aria-label="翌月">
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="mt-2 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map(w => (
          <span key={w} className="py-1">{w}</span>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7">
        {days.map((date, i) => {
          const key = toDateKey(date);
          const record = records.find(r => r.date === key);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = key === todayKey;

          return (
            <DayCell
              key={i}
              date={date}
              record={record}
              totalExpected={totalExpected}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              onClick={() => onDayClick(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

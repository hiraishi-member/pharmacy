'use client';

import { DailyRecord } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DayCellProps {
  date: Date;
  record?: DailyRecord;
  totalExpected: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

export function DayCell({
  date,
  record,
  totalExpected,
  isToday,
  isCurrentMonth,
  onClick,
}: DayCellProps) {
  const day = date.getDate();
  const takenCount = record?.checks.filter(c => c.taken).length ?? 0;

  // インジケーター: 全服用=green, 一部=yellow, 未服用=なし
  let indicator: 'full' | 'partial' | 'none' = 'none';
  if (totalExpected > 0 && takenCount > 0) {
    indicator = takenCount >= totalExpected ? 'full' : 'partial';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-sm transition-colors',
        isCurrentMonth
          ? 'text-foreground hover:bg-secondary'
          : 'text-muted-foreground/40',
        isToday && 'bg-primary/10 font-semibold text-primary'
      )}
    >
      <span>{day}</span>
      <span
        className={cn(
          'size-1.5 rounded-full',
          indicator === 'full' && 'bg-success',
          indicator === 'partial' && 'bg-warning',
          indicator === 'none' && 'bg-transparent'
        )}
      />
    </button>
  );
}

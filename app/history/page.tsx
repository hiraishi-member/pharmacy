'use client';

import { useState } from 'react';
import { Calendar } from '@/components/Calendar';
import { DayDetailSheet } from '@/components/DayDetailSheet';
import { useMedicines } from '@/hooks/useMedicines';
import { useRecords } from '@/hooks/useRecords';

export default function HistoryPage() {
  const { medicines, isLoaded: medLoaded } = useMedicines();
  const { records, isLoaded: recLoaded, getRecordByDate } = useRecords();

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const isLoaded = medLoaded && recLoaded;

  if (!isLoaded) {
    return <div className="px-4 pt-6" />;
  }

  const selectedRecord = selectedDate ? getRecordByDate(selectedDate) : undefined;

  return (
    <div className="px-4 pt-6">
      <h1 className="text-lg font-semibold">服薬履歴</h1>

      <div className="mt-4">
        <Calendar
          records={records}
          medicines={medicines}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={setSelectedDate}
        />
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-success" />
          全て服用
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-warning" />
          一部服用
        </span>
      </div>

      {/* 日別詳細 Sheet */}
      <DayDetailSheet
        open={!!selectedDate}
        onOpenChange={open => !open && setSelectedDate(null)}
        date={selectedDate ?? ''}
        record={selectedRecord}
        medicines={medicines}
      />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Pill, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimingSection } from '@/components/TimingSection';
import { useMedicines } from '@/hooks/useMedicines';
import { useRecords } from '@/hooks/useRecords';
import { TIMING_ORDER, toDateKey } from '@/lib/constants';

function formatToday(): { dateKey: string; display: string } {
  const now = new Date();
  const dateKey = toDateKey(now);
  const display = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(now);
  return { dateKey, display };
}

export default function HomePage() {
  const { activeMedicines, isLoaded: medLoaded } = useMedicines();
  const { toggleCheck, getTodayRecord, isLoaded: recLoaded } = useRecords();

  const isLoaded = medLoaded && recLoaded;
  const { dateKey, display } = formatToday();
  const todayRecord = getTodayRecord();
  const checks = todayRecord?.checks ?? [];

  // サマリー計算: 今日飲むべき総数と服用済み数
  const totalExpected = activeMedicines.reduce((sum, m) => sum + m.timings.length, 0);
  const totalTaken = checks.filter(c => c.taken).length;

  if (!isLoaded) {
    return <div className="px-4 pt-6" />;
  }

  return (
    <div className="px-4 pt-6">
      {/* 日付 */}
      <p className="text-xs text-muted-foreground">{display}</p>
      <h1 className="mt-1 text-lg font-semibold">今日の服薬</h1>

      {activeMedicines.length === 0 ? (
        /* 空状態 */
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <Pill className="size-8 text-primary" />
          </div>
          <div>
            <p className="font-medium">お薬が登録されていません</p>
            <p className="mt-1 text-sm text-muted-foreground">
              お薬を登録すると、ここでチェックできます
            </p>
          </div>
          <Button asChild>
            <Link href="/medicines/new">
              <Plus className="size-4" />
              お薬を登録する
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* サマリー */}
          <div className="mt-4 rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">服薬状況</span>
              <span className="text-sm font-semibold">
                {totalTaken} / {totalExpected}
              </span>
            </div>
            {/* プログレスバー */}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: totalExpected > 0
                    ? `${(totalTaken / totalExpected) * 100}%`
                    : '0%',
                }}
              />
            </div>
            {totalTaken === totalExpected && totalExpected > 0 && (
              <p className="mt-2 text-center text-xs font-medium text-primary">
                今日のお薬は全て服用済みです
              </p>
            )}
          </div>

          {/* タイミング別セクション */}
          <div className="mt-6 space-y-6 pb-4">
            {TIMING_ORDER.map(timing => (
              <TimingSection
                key={timing}
                timing={timing}
                medicines={activeMedicines}
                checks={checks}
                onToggle={(medicineId, t) => toggleCheck(dateKey, medicineId, t)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { TimingBadge } from '@/components/TimingBadge';
import { DailyRecord, Medicine, TimingSlot } from '@/lib/types';
import { TIMING_ORDER } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DayDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  record?: DailyRecord;
  medicines: Medicine[];
}

function formatSheetDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

interface CheckItem {
  medicine: Medicine;
  timing: TimingSlot;
  taken: boolean;
}

export function DayDetailSheet({
  open,
  onOpenChange,
  date,
  record,
  medicines,
}: DayDetailSheetProps) {
  // 全お薬×全タイミングの一覧を作成
  const items: CheckItem[] = [];
  if (date) {
    for (const timing of TIMING_ORDER) {
      for (const medicine of medicines) {
        if (!medicine.timings.includes(timing)) continue;
        const taken = record?.checks.some(
          c => c.medicineId === medicine.id && c.timing === timing && c.taken
        ) ?? false;
        items.push({ medicine, timing, taken });
      }
    }
  }

  const takenCount = items.filter(i => i.taken).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[70vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{date ? formatSheetDate(date) : ''}</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? 'この日の服薬記録はありません'
              : `${takenCount} / ${items.length} 服用済み`}
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 && (
          <div className="overflow-y-auto px-4 pb-6">
            <div className="space-y-2">
              {items.map(({ medicine, timing, taken }) => (
                <div
                  key={`${medicine.id}-${timing}`}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {taken ? (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground/40" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      'text-sm font-medium',
                      taken && 'text-muted-foreground line-through'
                    )}>
                      {medicine.name}
                    </p>
                  </div>
                  <TimingBadge timing={timing} />
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

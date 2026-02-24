'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Medicine, TimingSlot } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MedicineCheckCardProps {
  medicine: Medicine;
  timing: TimingSlot;
  taken: boolean;
  onToggle: () => void;
}

export function MedicineCheckCard({
  medicine,
  taken,
  onToggle,
}: MedicineCheckCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer gap-0 py-3 transition-all duration-200 active:scale-95',
        taken
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
      )}
      onClick={onToggle}
      role="checkbox"
      aria-checked={taken}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <CardContent className="flex items-center gap-3">
        {taken ? (
          <CheckCircle2 className="size-6 shrink-0 text-primary" />
        ) : (
          <Circle className="size-6 shrink-0 text-muted-foreground/40" />
        )}
        <div className="min-w-0 flex-1">
          <p className={cn(
            'text-sm font-medium leading-tight',
            taken && 'line-through text-muted-foreground'
          )}>
            {medicine.name}
          </p>
          {medicine.memo && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {medicine.memo}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Pencil, Trash2, Pause, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimingBadge } from '@/components/TimingBadge';
import { Medicine } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: () => void;
  onDelete: () => void;
  onSuspend?: () => void;
  onResume?: () => void;
}

export function MedicineCard({ medicine, onEdit, onDelete, onSuspend, onResume }: MedicineCardProps) {
  const isSuspended = !!medicine.suspended;

  return (
    <Card className={cn('gap-0 py-4', isSuspended && 'opacity-60')}>
      <CardContent className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold leading-tight">{medicine.name}</h3>
            {isSuspended && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                停止中
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {medicine.timings.map(timing => (
              <TimingBadge key={timing} timing={timing} />
            ))}
          </div>
          {medicine.memo && (
            <p className="text-xs text-muted-foreground">{medicine.memo}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {isSuspended ? (
            onResume && (
              <Button variant="ghost" size="icon" onClick={onResume} aria-label="再開">
                <Play className="size-4 text-primary" />
              </Button>
            )
          ) : (
            onSuspend && (
              <Button variant="ghost" size="icon" onClick={onSuspend} aria-label="停止">
                <Pause className="size-4 text-muted-foreground" />
              </Button>
            )
          )}
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="編集">
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="削除">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

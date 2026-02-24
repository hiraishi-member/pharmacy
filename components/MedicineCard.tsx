'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimingBadge } from '@/components/TimingBadge';
import { Medicine } from '@/lib/types';

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: () => void;
  onDelete: () => void;
}

export function MedicineCard({ medicine, onEdit, onDelete }: MedicineCardProps) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="font-semibold leading-tight">{medicine.name}</h3>
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

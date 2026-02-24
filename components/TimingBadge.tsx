'use client';

import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TimingSlot } from '@/lib/types';
import { TIMING_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

const iconMap = {
  Sunrise,
  Sun,
  Sunset,
  Moon,
} as const;

export function TimingBadge({ timing }: { timing: TimingSlot }) {
  const config = TIMING_CONFIG[timing];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1 border-transparent text-foreground',
        config.color
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}

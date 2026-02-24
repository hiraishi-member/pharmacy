'use client';

import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { MedicineCheckCard } from '@/components/MedicineCheckCard';
import { Medicine, Check, TimingSlot } from '@/lib/types';
import { TIMING_CONFIG } from '@/lib/constants';

const iconMap = {
  Sunrise,
  Sun,
  Sunset,
  Moon,
} as const;

interface TimingSectionProps {
  timing: TimingSlot;
  medicines: Medicine[];
  checks: Check[];
  onToggle: (medicineId: string, timing: TimingSlot) => void;
}

export function TimingSection({
  timing,
  medicines,
  checks,
  onToggle,
}: TimingSectionProps) {
  // このタイミングを持つお薬のみフィルタ
  const filtered = medicines.filter(m => m.timings.includes(timing));

  if (filtered.length === 0) return null;

  const config = TIMING_CONFIG[timing];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">{config.label}</h2>
      </div>
      <div className="space-y-2">
        {filtered.map(medicine => {
          const taken = checks.some(
            c => c.medicineId === medicine.id && c.timing === timing && c.taken
          );
          return (
            <MedicineCheckCard
              key={medicine.id}
              medicine={medicine}
              timing={timing}
              taken={taken}
              onToggle={() => onToggle(medicine.id, timing)}
            />
          );
        })}
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Medicine, TimingSlot } from '@/lib/types';
import { TIMING_ORDER, TIMING_CONFIG } from '@/lib/constants';

interface MedicineFormProps {
  defaultValues?: Medicine;
  onSubmit: (data: Omit<Medicine, 'id' | 'createdAt'>) => void;
}

export function MedicineForm({ defaultValues, onSubmit }: MedicineFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [timings, setTimings] = useState<TimingSlot[]>(defaultValues?.timings ?? []);
  const [memo, setMemo] = useState(defaultValues?.memo ?? '');
  const [errors, setErrors] = useState<{ name?: string; timings?: string }>({});

  const toggleTiming = (timing: TimingSlot) => {
    setTimings(prev =>
      prev.includes(timing)
        ? prev.filter(t => t !== timing)
        : [...prev, timing]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'お薬名を入力してください';
    if (timings.length === 0) newErrors.timings = 'タイミングを1つ以上選択してください';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ name: name.trim(), timings, memo: memo.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* お薬名 */}
      <div className="space-y-2">
        <Label htmlFor="name">お薬の名前 <span className="text-destructive">*</span></Label>
        <Input
          id="name"
          placeholder="例: ロキソニン"
          value={name}
          onChange={e => setName(e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* 服用タイミング */}
      <div className="space-y-2">
        <Label>服用タイミング <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-2 gap-3">
          {TIMING_ORDER.map(timing => {
            const config = TIMING_CONFIG[timing];
            const checked = timings.includes(timing);
            return (
              <label
                key={timing}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-secondary"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleTiming(timing)}
                />
                <span className="text-sm font-medium">{config.label}</span>
              </label>
            );
          })}
        </div>
        {errors.timings && (
          <p className="text-xs text-destructive">{errors.timings}</p>
        )}
      </div>

      {/* メモ */}
      <div className="space-y-2">
        <Label htmlFor="memo">メモ（任意）</Label>
        <Textarea
          id="memo"
          placeholder="用量や注意点などをメモ"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          rows={3}
        />
      </div>

      {/* 送信 */}
      <Button type="submit" className="w-full active:scale-95" size="lg">
        {defaultValues ? '保存する' : '登録する'}
      </Button>
    </form>
  );
}

import { TimingSlot } from './types';

export const TIMING_CONFIG: Record<TimingSlot, {
  label: string;
  icon: string;
  color: string;
  order: number;
}> = {
  morning:  { label: '朝',     icon: 'Sunrise', color: 'bg-timing-morning', order: 0 },
  noon:     { label: '昼',     icon: 'Sun',     color: 'bg-timing-noon',    order: 1 },
  evening:  { label: '夕',     icon: 'Sunset',  color: 'bg-timing-evening', order: 2 },
  bedtime:  { label: '就寝前', icon: 'Moon',    color: 'bg-timing-bedtime', order: 3 },
};

export const TIMING_ORDER: TimingSlot[] = ['morning', 'noon', 'evening', 'bedtime'];

export const STORAGE_KEYS = {
  MEDICINES: 'medicines',
  RECORDS: 'records',
} as const;

/** ローカルタイムゾーンで YYYY-MM-DD 文字列を生成 */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export type TimingSlot = 'morning' | 'noon' | 'evening' | 'bedtime';

export interface Medicine {
  id: string;
  name: string;
  timings: TimingSlot[];
  memo: string;
  createdAt: string;
}

export interface Check {
  medicineId: string;
  timing: TimingSlot;
  taken: boolean;
  checkedAt?: string;
}

export interface DailyRecord {
  date: string;
  checks: Check[];
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyRecord, TimingSlot } from '@/lib/types';
import { toDateKey } from '@/lib/constants';
import * as storage from '@/lib/storage';

export function useRecords() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み
  useEffect(() => {
    setRecords(storage.getRecords());
    setIsLoaded(true);
  }, []);

  // State → localStorage 同期
  useEffect(() => {
    if (isLoaded) {
      storage.saveRecords(records);
    }
  }, [records, isLoaded]);

  const toggleCheck = useCallback((date: string, medicineId: string, timing: TimingSlot) => {
    setRecords(prev => {
      const next = prev.map(r => ({ ...r, checks: [...r.checks] }));
      let record = next.find(r => r.date === date);

      if (!record) {
        record = { date, checks: [] };
        next.push(record);
      }

      const checkIndex = record.checks.findIndex(
        c => c.medicineId === medicineId && c.timing === timing
      );

      if (checkIndex === -1) {
        record.checks.push({
          medicineId,
          timing,
          taken: true,
          checkedAt: new Date().toISOString(),
        });
      } else {
        // トグル: 服用済み → 削除
        record.checks.splice(checkIndex, 1);
      }

      return next;
    });
  }, []);

  const getRecordByDate = useCallback((date: string) => {
    return records.find(r => r.date === date);
  }, [records]);

  const getTodayRecord = useCallback(() => {
    const today = toDateKey();
    return records.find(r => r.date === today);
  }, [records]);

  return {
    records,
    isLoaded,
    toggleCheck,
    getRecordByDate,
    getTodayRecord,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Medicine } from '@/lib/types';
import * as storage from '@/lib/storage';

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み
  useEffect(() => {
    setMedicines(storage.getMedicines());
    setIsLoaded(true);
  }, []);

  // State → localStorage 同期
  useEffect(() => {
    if (isLoaded) {
      storage.saveMedicines(medicines);
    }
  }, [medicines, isLoaded]);

  const addMedicine = useCallback((data: Omit<Medicine, 'id' | 'createdAt'>) => {
    const newMedicine: Medicine = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setMedicines(prev => [...prev, newMedicine]);
  }, []);

  const updateMedicine = useCallback((id: string, data: Partial<Omit<Medicine, 'id' | 'createdAt'>>) => {
    setMedicines(prev => {
      const old = prev.find(m => m.id === id);
      const updated = prev.map(m => m.id === id ? { ...m, ...data } : m);

      // タイミングが変更された場合、削除されたタイミングのチェックをクリーンアップ
      if (old && data.timings) {
        const removedTimings = old.timings.filter(t => !data.timings!.includes(t));
        if (removedTimings.length > 0) {
          const records = storage.getRecords().map(record => ({
            ...record,
            checks: record.checks.filter(
              c => !(c.medicineId === id && removedTimings.includes(c.timing))
            ),
          }));
          storage.saveRecords(records);
        }
      }

      return updated;
    });
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    // records側のクリーンアップはstorage層で実行
    const records = storage.getRecords().map(record => ({
      ...record,
      checks: record.checks.filter(c => c.medicineId !== id),
    }));
    storage.saveRecords(records);
  }, []);

  const getMedicineById = useCallback((id: string) => {
    return medicines.find(m => m.id === id);
  }, [medicines]);

  return {
    medicines,
    isLoaded,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicineById,
  };
}

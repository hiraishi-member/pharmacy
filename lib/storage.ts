import { Medicine, DailyRecord, TimingSlot } from './types';
import { STORAGE_KEYS } from './constants';

// --- お薬 ---

export function getMedicines(): Medicine[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMedicines(medicines: Medicine[]): void {
  localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
}

export function addMedicine(medicine: Medicine): void {
  const medicines = getMedicines();
  medicines.push(medicine);
  saveMedicines(medicines);
}

export function updateMedicine(id: string, updates: Partial<Omit<Medicine, 'id' | 'createdAt'>>): void {
  const medicines = getMedicines();
  const index = medicines.findIndex(m => m.id === id);
  if (index !== -1) {
    medicines[index] = { ...medicines[index], ...updates };
    saveMedicines(medicines);
  }
}

export function deleteMedicine(id: string): void {
  const medicines = getMedicines().filter(m => m.id !== id);
  saveMedicines(medicines);

  // 関連する記録のchecksからも削除
  const records = getRecords().map(record => ({
    ...record,
    checks: record.checks.filter(c => c.medicineId !== id),
  }));
  saveRecords(records);
}

// --- 日次記録 ---

export function getRecords(): DailyRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: DailyRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

export function getRecordByDate(date: string): DailyRecord | undefined {
  return getRecords().find(r => r.date === date);
}

export function toggleCheck(date: string, medicineId: string, timing: TimingSlot): void {
  const records = getRecords();
  let record = records.find(r => r.date === date);

  if (!record) {
    record = { date, checks: [] };
    records.push(record);
  }

  const checkIndex = record.checks.findIndex(
    c => c.medicineId === medicineId && c.timing === timing
  );

  if (checkIndex === -1) {
    // チェックが存在しない → 服用済みとして追加
    record.checks.push({
      medicineId,
      timing,
      taken: true,
      checkedAt: new Date().toISOString(),
    });
  } else {
    const check = record.checks[checkIndex];
    if (check.taken) {
      // 服用済み → 未服用に戻す（チェックを削除）
      record.checks.splice(checkIndex, 1);
    } else {
      // 未服用 → 服用済みに
      check.taken = true;
      check.checkedAt = new Date().toISOString();
    }
  }

  saveRecords(records);
}

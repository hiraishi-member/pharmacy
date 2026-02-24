'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicineForm } from '@/components/MedicineForm';
import { useMedicines } from '@/hooks/useMedicines';

export default function NewMedicinePage() {
  const router = useRouter();
  const { addMedicine } = useMedicines();

  return (
    <div className="px-4 pt-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="戻る">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">お薬を登録</h1>
      </div>

      {/* フォーム */}
      <div className="mt-6">
        <MedicineForm
          onSubmit={data => {
            addMedicine(data);
            router.push('/medicines');
          }}
        />
      </div>
    </div>
  );
}

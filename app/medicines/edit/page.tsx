'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicineForm } from '@/components/MedicineForm';
import { useMedicines } from '@/hooks/useMedicines';

function EditMedicineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { isLoaded, updateMedicine, getMedicineById } = useMedicines();

  const medicine = id ? getMedicineById(id) : undefined;

  useEffect(() => {
    if (isLoaded && (!id || !medicine)) {
      router.replace('/medicines');
    }
  }, [isLoaded, id, medicine, router]);

  if (!isLoaded || !medicine || !id) {
    return <div className="px-4 pt-6" />;
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="戻る">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">お薬を編集</h1>
      </div>

      <div className="mt-6">
        <MedicineForm
          defaultValues={medicine}
          onSubmit={data => {
            updateMedicine(id, data);
            router.push('/medicines');
          }}
        />
      </div>
    </div>
  );
}

export default function EditMedicinePage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6" />}>
      <EditMedicineContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { MedicineCard } from '@/components/MedicineCard';
import { useMedicines } from '@/hooks/useMedicines';

export default function MedicinesPage() {
  const { medicines, isLoaded, deleteMedicine } = useMedicines();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const targetMedicine = deleteTarget
    ? medicines.find(m => m.id === deleteTarget)
    : null;

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMedicine(deleteTarget);
      setDeleteTarget(null);
    }
  };

  if (!isLoaded) {
    return <div className="px-4 pt-6" />;
  }

  return (
    <div className="px-4 pt-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">お薬一覧</h1>
        <Button asChild size="sm">
          <Link href="/medicines/new">
            <Plus className="size-4" />
            追加
          </Link>
        </Button>
      </div>

      {/* お薬リスト or 空状態 */}
      {medicines.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <Pill className="size-8 text-primary" />
          </div>
          <div>
            <p className="font-medium">お薬が登録されていません</p>
            <p className="mt-1 text-sm text-muted-foreground">
              まずはお薬を登録しましょう
            </p>
          </div>
          <Button asChild>
            <Link href="/medicines/new">
              <Plus className="size-4" />
              お薬を登録する
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {medicines.map(medicine => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onEdit={() => router.push(`/medicines/edit?id=${medicine.id}`)}
              onDelete={() => setDeleteTarget(medicine.id)}
            />
          ))}
        </div>
      )}

      {/* 削除確認ダイアログ */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>お薬を削除しますか？</DialogTitle>
            <DialogDescription>
              「{targetMedicine?.name}」を削除します。この操作は取り消せません。
              関連する服薬記録も削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

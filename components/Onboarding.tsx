'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, CheckCircle2, ChevronRight, List, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STORAGE_KEYS } from '@/lib/constants';

const slides = [
  {
    id: 'intro',
    icon: <Pill className="size-12 text-primary" />,
    title: 'お薬の管理をかんたんに',
    description:
      '毎日のお薬の飲み忘れを防いで、\n健康的な毎日をサポートします。',
  },
  {
    id: 'features',
    title: '便利な3つの機能',
    description: '',
    features: [
      { icon: <CheckCircle2 className="size-6 text-primary" />, label: '毎日の服薬チェック' },
      { icon: <CalendarDays className="size-6 text-primary" />, label: 'カレンダーで履歴確認' },
      { icon: <List className="size-6 text-primary" />, label: 'お薬の一覧管理' },
    ],
  },
  {
    id: 'cta',
    icon: <Pill className="size-12 text-primary" />,
    title: 'さっそくお薬を\n登録しましょう！',
    description: 'お薬の名前と飲むタイミングを\n登録するだけでスタートできます。',
  },
] as const;

function complete(key: string) {
  localStorage.setItem(key, 'true');
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const isLast = current === slides.length - 1;

  const next = useCallback(() => {
    if (isLast) return;
    setCurrent(prev => prev + 1);
  }, [isLast]);

  const prev = useCallback(() => {
    if (current === 0) return;
    setCurrent(prev => prev - 1);
  }, [current]);

  const handleSkip = useCallback(() => {
    complete(STORAGE_KEYS.ONBOARDING_COMPLETED);
    onComplete();
  }, [onComplete]);

  const handleStart = useCallback(() => {
    complete(STORAGE_KEYS.ONBOARDING_COMPLETED);
    onComplete();
    router.push('/medicines/new');
  }, [onComplete, router]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) next();
      else prev();
    },
    [next, prev],
  );

  const slide = slides[current];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Skip */}
      <div className="flex justify-end px-4 pt-4">
        {!isLast && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            スキップ
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        {slide.id === 'features' ? (
          <>
            <h2 className="text-xl font-semibold">{slide.title}</h2>
            <div className="mt-8 flex w-full max-w-xs flex-col gap-5">
              {slide.features.map(f => (
                <div key={f.label} className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4">
                  {f.icon}
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex size-24 items-center justify-center rounded-full bg-secondary">
              {slide.icon}
            </div>
            <h2 className="mt-6 whitespace-pre-line text-xl font-semibold">{slide.title}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {slide.description}
            </p>
          </>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-6 px-8 pb-24">
        {/* Dot indicator */}
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={`size-2 rounded-full transition-colors ${
                i === current ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {/* Action button */}
        {isLast ? (
          <Button className="w-full max-w-xs" size="lg" onClick={handleStart}>
            はじめる
          </Button>
        ) : (
          <Button className="w-full max-w-xs" size="lg" onClick={next}>
            次へ
            <ChevronRight className="ml-1 size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

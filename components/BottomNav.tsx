'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pill, CalendarDays, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: '今日', icon: CheckCircle2 },
  { href: '/medicines', label: 'お薬', icon: Pill },
  { href: '/history', label: '履歴', icon: CalendarDays },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

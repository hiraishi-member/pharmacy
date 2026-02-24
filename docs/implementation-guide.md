# 実装ガイド

## 1. 現在の状態

| 項目 | ステータス | 備考 |
|------|-----------|------|
| Next.js 16 プロジェクト初期化 | ✅ 済 | Next.js 16.1.6, React 19.2.3 |
| Tailwind CSS v4 + PostCSS | ✅ 済 | `@tailwindcss/postcss` 導入済み |
| shadcn CLI 導入 | ✅ 済 | `shadcn` v3.8.5 (devDependencies) |
| shadcn/ui コンポーネント追加 | ❌ 未 | 0個。一括追加が必要 |
| ピンクテーマ CSS変数 | ✅ 済 | `globals.css` にカスタムカラー定義済み |
| Noto Sans JP フォント | ✅ 済 | `layout.tsx` に設定済み |
| `lib/utils.ts` (cn関数) | ✅ 済 | shadcn 初期化時に作成済み |
| Lucide React | ✅ 済 | `lucide-react` v0.575.0 |
| `next.config.ts` output: export | ❌ 未 | 静的エクスポート設定が必要 |
| `app/layout.tsx` | ⚠️ 要修正 | BottomNav追加・max-w-md レイアウト適用が必要 |
| `app/page.tsx` | ⚠️ 要修正 | デフォルトテンプレートのまま |
| `components/` ディレクトリ | ❌ 未 | 未作成 |
| `hooks/` ディレクトリ | ❌ 未 | 未作成 |

---

## 2. セットアップ手順

### 2.1 shadcn/ui コンポーネント一括追加

```bash
npx shadcn@latest add button card badge checkbox dialog input label textarea sheet
```

### 2.2 ディレクトリ作成

```bash
mkdir -p components hooks
```

### 2.3 next.config.ts に静的エクスポート設定

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

> **注意**: `output: "export"` により `next build` で静的HTMLが生成される。Server Actions、Route Handlers、ミドルウェアは使用不可。

---

## 3. ファイル作成マップ

### Phase 1: 共通基盤

| # | ファイルパス | 概要 | 依存 |
|---|-------------|------|------|
| 1 | `lib/types.ts` | 型定義（Medicine, DailyRecord, Check, TimingSlot） | なし |
| 2 | `lib/constants.ts` | タイミング定数・ラベル・アイコン・カラーのマッピング | `lib/types.ts` |
| 3 | `lib/storage.ts` | localStorage CRUD関数 | `lib/types.ts` |
| 4 | `hooks/useMedicines.ts` | お薬データのカスタムフック | `lib/types.ts`, `lib/storage.ts` |
| 5 | `hooks/useRecords.ts` | 服薬記録のカスタムフック | `lib/types.ts`, `lib/storage.ts` |
| 6 | `components/BottomNav.tsx` | ボトムナビゲーション（3タブ） | なし |
| 7 | `app/layout.tsx` | ルートレイアウト修正（BottomNav統合） | `components/BottomNav.tsx` |

### Phase 2: お薬管理

| # | ファイルパス | 概要 | 依存 |
|---|-------------|------|------|
| 8 | `components/TimingBadge.tsx` | タイミング表示バッジ | `lib/constants.ts` |
| 9 | `components/MedicineForm.tsx` | お薬登録・編集フォーム（共通） | `lib/types.ts`, `hooks/useMedicines.ts` |
| 10 | `components/MedicineCard.tsx` | お薬一覧用カード | `lib/types.ts`, `components/TimingBadge.tsx` |
| 11 | `app/medicines/page.tsx` | お薬一覧ページ | `hooks/useMedicines.ts`, `components/MedicineCard.tsx` |
| 12 | `app/medicines/new/page.tsx` | お薬登録ページ | `components/MedicineForm.tsx` |
| 13 | `app/medicines/[id]/edit/page.tsx` | お薬編集ページ | `components/MedicineForm.tsx` |

### Phase 3: 日次チェック（ホーム）

| # | ファイルパス | 概要 | 依存 |
|---|-------------|------|------|
| 14 | `components/MedicineCheckCard.tsx` | 服薬チェックカード（ON/OFF切替） | `lib/types.ts`, `components/TimingBadge.tsx` |
| 15 | `components/TimingSection.tsx` | タイミング別セクション（朝・昼・夕・就寝前） | `components/MedicineCheckCard.tsx` |
| 16 | `app/page.tsx` | 今日の服薬ページ（ホーム画面） | `hooks/useMedicines.ts`, `hooks/useRecords.ts`, `components/TimingSection.tsx` |

### Phase 4: カレンダー履歴

| # | ファイルパス | 概要 | 依存 |
|---|-------------|------|------|
| 17 | `components/DayCell.tsx` | カレンダー日付セル（インジケーター付き） | `lib/types.ts` |
| 18 | `components/Calendar.tsx` | 月間カレンダー | `components/DayCell.tsx` |
| 19 | `components/DayDetailSheet.tsx` | 日別詳細（Sheet/BottomSheet） | `lib/types.ts` |
| 20 | `app/history/page.tsx` | カレンダー履歴ページ | `hooks/useRecords.ts`, `hooks/useMedicines.ts`, `components/Calendar.tsx`, `components/DayDetailSheet.tsx` |

---

## 4. 共通基盤ファイル仕様

### 4.1 `lib/types.ts`

```ts
export type TimingSlot = 'morning' | 'noon' | 'evening' | 'bedtime';

export interface Medicine {
  id: string;          // crypto.randomUUID()
  name: string;
  timings: TimingSlot[];
  memo: string;
  createdAt: string;   // ISO 8601
}

export interface Check {
  medicineId: string;
  timing: TimingSlot;
  taken: boolean;
  checkedAt?: string;  // ISO 8601
}

export interface DailyRecord {
  date: string;        // YYYY-MM-DD
  checks: Check[];
}
```

### 4.2 `lib/constants.ts`

```ts
import { TimingSlot } from './types';

export const TIMING_CONFIG: Record<TimingSlot, {
  label: string;
  icon: string;        // Lucide アイコン名
  color: string;       // Tailwind クラス（背景色）
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
```

### 4.3 `lib/storage.ts`

```ts
// localStorage CRUD のシグネチャ

// お薬
export function getMedicines(): Medicine[];
export function saveMedicines(medicines: Medicine[]): void;
export function addMedicine(medicine: Medicine): void;
export function updateMedicine(id: string, updates: Partial<Omit<Medicine, 'id' | 'createdAt'>>): void;
export function deleteMedicine(id: string): void;

// 日次記録
export function getRecords(): DailyRecord[];
export function saveRecords(records: DailyRecord[]): void;
export function getRecordByDate(date: string): DailyRecord | undefined;
export function toggleCheck(date: string, medicineId: string, timing: TimingSlot): void;
```

**実装パターン**: 各関数は `JSON.parse(localStorage.getItem(key))` で読み取り、`localStorage.setItem(key, JSON.stringify(data))` で書き込む。読み取り失敗時は空配列 `[]` を返す。

### 4.4 `hooks/useMedicines.ts`

```ts
// 返り値
{
  medicines: Medicine[];
  isLoaded: boolean;          // ハイドレーション対策フラグ
  addMedicine: (data: Omit<Medicine, 'id' | 'createdAt'>) => void;
  updateMedicine: (id: string, data: Partial<Omit<Medicine, 'id' | 'createdAt'>>) => void;
  deleteMedicine: (id: string) => void;
  getMedicineById: (id: string) => Medicine | undefined;
}
```

### 4.5 `hooks/useRecords.ts`

```ts
// 返り値
{
  records: DailyRecord[];
  isLoaded: boolean;
  toggleCheck: (date: string, medicineId: string, timing: TimingSlot) => void;
  getRecordByDate: (date: string) => DailyRecord | undefined;
  getTodayRecord: () => DailyRecord | undefined;
}
```

---

## 5. コンポーネント仕様

| コンポーネント | Props | 使用UIパーツ | 振る舞い |
|---------------|-------|-------------|---------|
| `BottomNav` | なし（`usePathname()`で現在地判定） | なし（カスタム実装） | 3タブ（今日/お薬/履歴）を表示。アクティブタブをピンクでハイライト。`fixed bottom-0`。 |
| `TimingBadge` | `timing: TimingSlot` | `Badge` | タイミングに応じたアイコン+ラベル+背景色のバッジを表示。 |
| `MedicineForm` | `defaultValues?: Medicine`, `onSubmit: (data) => void` | `Input`, `Label`, `Textarea`, `Checkbox`, `Button` | 名前（必須）、タイミング（1つ以上必須）、メモ（任意）のフォーム。登録・編集で共用。 |
| `MedicineCard` | `medicine: Medicine`, `onEdit: () => void`, `onDelete: () => void` | `Card`, `Button`, `Badge` | お薬名・タイミングバッジ・メモを表示。編集・削除ボタン付き。 |
| `MedicineCheckCard` | `medicine: Medicine`, `timing: TimingSlot`, `taken: boolean`, `onToggle: () => void` | `Card`, `Checkbox` | お薬名とチェックボックスを表示。チェック状態でスタイルが変わる。`transition-all duration-200`。 |
| `TimingSection` | `timing: TimingSlot`, `medicines: Medicine[]`, `checks: Check[]`, `onToggle: (medicineId, timing) => void` | なし（`MedicineCheckCard`をラップ） | タイミングラベル＋対象お薬のチェックカード一覧。対象薬がない場合は非表示。 |
| `Calendar` | `records: DailyRecord[]`, `medicines: Medicine[]`, `currentMonth: Date`, `onMonthChange: (date) => void`, `onDayClick: (date) => void` | `Button` | 月間カレンダーグリッド。前月/翌月ボタン。各日に`DayCell`を表示。 |
| `DayCell` | `date: Date`, `record?: DailyRecord`, `totalExpected: number`, `onClick: () => void` | なし | 日付数字＋服薬ステータスインジケーター（ドット: 緑=全服用, 黄=一部, なし=未服用）。 |
| `DayDetailSheet` | `open: boolean`, `onOpenChange: (open) => void`, `date: string`, `record?: DailyRecord`, `medicines: Medicine[]` | `Sheet` | 選択日の服薬詳細をボトムシートで表示。薬名・タイミング・服用状態を一覧。 |

---

## 6. ページ実装ノート

### `/` — 今日の服薬（ホーム）

- **状態**: `useMedicines()` + `useRecords()`
- **表示ロジック**: `TIMING_ORDER` 順にループ → そのタイミングを持つ薬をフィルタ → `TimingSection` で描画
- **サマリー**: 上部に「今日の服薬: 3/8 完了」のようなプログレス表示
- **空状態**: お薬未登録時は「お薬を登録しましょう」メッセージ + お薬登録へのリンクボタン
- **日付表示**: `今日の日付` を `YYYY年M月D日（曜日）` 形式で表示

### `/medicines` — お薬一覧

- **状態**: `useMedicines()`
- **表示**: `MedicineCard` のリスト
- **追加ボタン**: 右下に FAB（Floating Action Button）または上部に `+ 追加` ボタン
- **削除**: `Dialog` で確認 → `deleteMedicine(id)` → 関連する `records` の `checks` からも該当 `medicineId` を削除
- **空状態**: 「お薬が登録されていません」メッセージ

### `/medicines/new` — お薬登録

- **コンポーネント**: `MedicineForm` を `defaultValues` なしで使用
- **保存後**: `/medicines` にリダイレクト（`router.push('/medicines')`）

### `/medicines/[id]/edit` — お薬編集

- **パラメータ**: Next.js 16 では `params` が `Promise` → `const { id } = await params;` (**後述の注意点参照**)
- **コンポーネント**: `MedicineForm` を `defaultValues={medicine}` で使用
- **存在しないID**: `/medicines` にリダイレクト

### `/history` — カレンダー履歴

- **状態**: `useRecords()` + `useMedicines()` + `useState` で `currentMonth` と `selectedDate`
- **インジケーター計算**: その日の `checks` の `taken: true` 数 / その日に期待される全チェック数
- **期待チェック数**: `medicines.reduce((sum, m) => sum + m.timings.length, 0)`（その日時点で登録済みだった薬の数が理想だが、簡易実装として現在の登録薬で計算）
- **日付タップ**: `DayDetailSheet` を開く

---

## 7. 状態管理パターン

### localStorage 同期パターン（全カスタムフック共通）

```ts
'use client';

import { useState, useEffect } from 'react';

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み（クライアントサイドのみ）
  useEffect(() => {
    const data = getMedicines(); // lib/storage.ts
    setMedicines(data);
    setIsLoaded(true);
  }, []);

  // State → localStorage 同期（初回ロード後のみ）
  useEffect(() => {
    if (isLoaded) {
      saveMedicines(medicines);
    }
  }, [medicines, isLoaded]);

  // ... CRUD操作は setMedicines を更新
}
```

**重要**: `isLoaded` が `false` の間はスケルトンまたは空表示にし、サーバーレンダリングとのハイドレーション不一致を防ぐ。

### UUID 生成

```ts
crypto.randomUUID()  // 全モダンブラウザ対応
```

### 日付フォーマット

```ts
// 今日の日付 → YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// 表示用
const formatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
});
```

---

## 8. 実装時の注意事項

### 8.1 Next.js 16 — params が Promise

Next.js 15以降、動的ルートの `params` は `Promise` になった。

```ts
// ❌ 旧: 同期アクセス
export default function EditPage({ params }: { params: { id: string } }) {
  const { id } = params;

// ✅ 新: 非同期ページコンポーネント
export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

// ✅ Client Component の場合は use() を使用
'use client';
import { use } from 'react';
export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
```

**本プロジェクトでは**: 編集ページは `'use client'` なので `use(params)` を使う。

### 8.2 ハイドレーション対策

`localStorage` はサーバーサイドに存在しない。直接参照するとハイドレーションエラーが発生する。

- **対策**: カスタムフックの `isLoaded` フラグで制御
- **初期値**: State の初期値は空配列 `[]`（サーバーと一致させる）
- **描画**: `isLoaded === false` の間はローディング表示またはスケルトン

### 8.3 静的エクスポート制約

`output: "export"` 設定下の制約:

- ❌ Server Actions（`'use server'`）
- ❌ Route Handlers（`app/api/`）
- ❌ ミドルウェア（`middleware.ts`）
- ❌ `next/headers`, `cookies()`, `headers()`
- ✅ Client Components（`'use client'`）のみ使用
- ✅ 動的ルート `[id]` は `generateStaticParams` で事前生成が必要だが、localStorage依存のため空配列を返してフォールバック

### 8.4 動的ルートと静的エクスポート

`/medicines/[id]/edit` は動的ルート。静的エクスポートでは `generateStaticParams` が必要:

```ts
export function generateStaticParams() {
  return []; // localStorage依存のため空。実行時にクライアントで解決
}
```

> `next.config.ts` で `trailingSlash: true` を設定すると、SPA的なルーティングが安定する場合がある。

### 8.5 削除時の整合性

お薬を削除する際、`records` 内の該当 `medicineId` を持つ `checks` も削除する:

```ts
function deleteMedicine(id: string) {
  // 1. medicines から削除
  setMedicines(prev => prev.filter(m => m.id !== id));

  // 2. records の checks から該当 medicineId を除去
  setRecords(prev => prev.map(record => ({
    ...record,
    checks: record.checks.filter(c => c.medicineId !== id),
  })));
}
```

**注意**: `useMedicines` と `useRecords` が別フックなので、削除処理は呼び出し側（ページコンポーネント）で両方のフックを使って実行する。または `deleteMedicine` を `storage.ts` レベルで両方のストレージを更新する設計にする。

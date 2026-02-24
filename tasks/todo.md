# お薬管理アプリ — 実装タスク

## Phase 0: 準備（完了）

- [x] Next.js プロジェクト初期化
- [x] shadcn/ui CLI 導入
- [x] ピンクテーマ適用（CSS変数・フォント）
- [x] 要件定義書 (`docs/requirements.md`)
- [x] UIデザイン方針 (`docs/ui-design.md`)
- [x] アーキテクチャ設計図 (`docs/architecture.md`)
- [x] 実装ガイド (`docs/implementation-guide.md`)

## Phase 1: 共通基盤（完了）

- [x] セットアップ: shadcn/ui コンポーネント一括追加 (`button card badge checkbox dialog input label textarea sheet`)
- [x] セットアップ: `next.config.ts` に `output: "export"` 設定
- [x] `lib/types.ts` — 型定義（Medicine, DailyRecord, Check, TimingSlot）
- [x] `lib/constants.ts` — タイミング定数・ラベル・アイコン・カラーマッピング
- [x] `lib/storage.ts` — localStorage CRUD関数
- [x] `hooks/useMedicines.ts` — お薬データのカスタムフック
- [x] `hooks/useRecords.ts` — 服薬記録のカスタムフック
- [x] `components/BottomNav.tsx` — ボトムナビゲーション（3タブ: 今日/お薬/履歴）
- [x] `app/layout.tsx` — ルートレイアウト修正（BottomNav統合、max-w-md中央寄せ）

## Phase 2: お薬管理（完了）

- [x] `components/TimingBadge.tsx` — タイミング表示バッジ
- [x] `components/MedicineForm.tsx` — お薬登録・編集フォーム（共通）
- [x] `components/MedicineCard.tsx` — お薬一覧用カード
- [x] `app/medicines/page.tsx` — お薬一覧ページ（空状態対応含む）
- [x] `app/medicines/new/page.tsx` — お薬登録ページ
- [x] `app/medicines/edit/page.tsx` — お薬編集ページ（クエリパラメータ `?id=` 方式に変更）

## Phase 3: 日次チェック（ホーム画面）（完了）

- [x] `components/MedicineCheckCard.tsx` — 服薬チェックカード（ON/OFF切替）
- [x] `components/TimingSection.tsx` — タイミング別お薬セクション
- [x] `app/page.tsx` — 今日の服薬ページ（サマリー表示・空状態対応含む）

## Phase 4: カレンダー履歴（完了）

- [x] `components/DayCell.tsx` — カレンダー日付セル（インジケーター付き）
- [x] `components/Calendar.tsx` — 月間カレンダー
- [x] `components/DayDetailSheet.tsx` — 日別詳細（Sheet）
- [x] `app/history/page.tsx` — カレンダー履歴ページ

## Phase 5: 仕上げ（完了）

- [x] エッジケース対応（DayDetailSheetの空date対策、削除時の記録整合性確認済み）
- [x] 全画面の動作確認（登録→編集→チェックON/OFF→履歴→Sheet→削除→整合性）
- [x] バリデーション確認（空入力でエラーメッセージ表示）
- [x] ビルド確認 (`next build` — 全6ルート静的生成成功）

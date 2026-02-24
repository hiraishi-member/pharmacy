# お薬管理アプリ

## ドキュメント

- 要件定義書: `docs/requirements.md`
- UIデザイン方針: `docs/ui-design.md`
- アーキテクチャ設計図: `docs/architecture.md`
- 実装ガイド: `docs/implementation-guide.md`
- 実装タスク: `tasks/todo.md`
- 教訓: `tasks/lessons.md`

## 技術スタック

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- localStorage（サーバー不要）
- Lucide React（アイコン）
- Noto Sans JP（フォント）

## プロジェクト構成ルール

- モバイルファースト設計（`max-w-md` 中央寄せ）
- ピンク＋白テーマ（女性向けかわいいデザイン）
- 日本語UI
- App Router（`app/` ディレクトリ）
- コンポーネント: `components/`、UI: `components/ui/`
- ユーティリティ: `lib/`

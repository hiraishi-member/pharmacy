# 教訓・注意事項

セッション中に学んだパターンや注意点を蓄積するファイル。同じミスを繰り返さないために参照する。

---

## Next.js 16 固有

- **params は Promise**: 動的ルート `[id]` の `params` は非同期。Server Component では `await params`、Client Component では `use(params)` を使う。旧式の同期アクセスはビルドエラーになる。
- **静的エクスポート制約**: `output: "export"` では Server Actions, Route Handlers, ミドルウェアが使用不可。全ページを `'use client'` で実装する。
- **動的ルート + 静的エクスポート**: `generateStaticParams()` が必要だが、`'use client'` と同一ファイルに共存不可。さらに空配列を返しても `output: "export"` ではページが生成されずビルドエラーになる。**解決策**: 動的ルート `/medicines/[id]/edit` → クエリパラメータ `/medicines/edit?id=xxx` 方式に変更。
- **useSearchParams は Suspense 必須**: `output: "export"` のプリレンダリング時に `useSearchParams()` がサスペンスを要求する。コンポーネントを分離し `<Suspense>` で囲む。

## ハイドレーション

- **localStorage の初期値**: サーバーレンダリング時に `localStorage` にアクセスするとエラー。`useState` の初期値は空配列 `[]` にし、`useEffect` 内で読み込む。
- **isLoaded パターン**: カスタムフックに `isLoaded: boolean` を持たせ、`false` の間はスケルトン/空表示にしてハイドレーションミスマッチを防ぐ。

## データ整合性

- **お薬削除時**: `medicines` から削除するだけでなく、`records` 内の該当 `medicineId` の `checks` も削除する。片方だけ消すと孤立データが残る。
- **タイミング編集時**: `updateMedicine` でタイミングを削除した場合、`records` 内の該当タイミングの `checks` もクリーンアップする。放置するとサマリーの完了数がずれる。

## 日付処理

- **UTC vs ローカル**: `toISOString().split('T')[0]` はUTC日付を返す。JST等では日付がずれる。日付キーは必ず `getFullYear()/getMonth()/getDate()` でローカル日付を生成すること。共通ヘルパー `toDateKey()` を `lib/constants.ts` に用意済み。

---

## 今後追記するカテゴリ（テンプレート）

### UI / スタイリング
<!-- Tailwind や shadcn/ui で遭遇した問題・解決策 -->

### パフォーマンス
<!-- レンダリング最適化や状態管理で学んだこと -->

### デバッグ
<!-- よくあるエラーとその原因・解決 -->

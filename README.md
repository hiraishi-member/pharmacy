This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Node.js のセキュリティ要件

Node.js **22.23.4 以上の 22 系**を使用してください。2026年10月21日の
[Node.js セキュリティ更新](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
で修正された Brotli デコード時の任意コード実行、TLS 証明書検証の不備などに対応するためです。
`npm update` や `@types/node` の更新では Node.js 本体は更新されません。

Node.js を公式インストーラーなどで更新し、新しいターミナルで `node --version` を確認してください。
nvm を使用している場合は `.nvmrc` のバージョンをインストールして切り替えられます。

```bash
node --version
npm run check:node
npm ci
npm run dev
```

`.npmrc` でインストール時の Node.js バージョン要件を必須にし、
`npm run dev`、`npm run build`、`npm start` の実行前にもバージョンを確認します。
依存パッケージを直接起動する場合も、必ず更新済みの Node.js を使用してください。
将来のセキュリティ更新時は `.nvmrc` と `package.json` の最低バージョンを合わせて更新してください。

このアプリは `output: "export"` により `out/` に静的ファイルを生成し、
服薬データと UUID の生成はブラウザ内で処理します。
静的ファイルのみを配信する構成では、閲覧時にアプリ用の Node.js サーバーは動作しません。
開発環境とビルド環境の Node.js 本体を更新することが今回の主な対策です。

Vercel は Node.js のメジャーバージョン単位で実行環境を管理し、マイナー・パッチ版を自動更新します。
次回デプロイではビルドログの Node.js バージョンが 22.23.4 以上であることと、
静的出力のみが配信されていることを確認してください。
今回のローカル変更だけで、公開済み環境のバージョン確認や再デプロイが完了したことにはなりません。
詳細は [Vercel の Node.js バージョン管理](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)を参照してください。

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

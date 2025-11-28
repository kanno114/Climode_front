# Climode Frontend

Climode のフロントエンドアプリケーション。Next.js 15（App Router）を使用した React アプリケーションです。

## 技術スタック

- **Node.js**: 23
- **React**: 19.1.0
- **Next.js**: 15.5.2（App Router）
- **TypeScript**: 5.x
- **認証**: next-auth 5.0.0-beta.29
- **UI**: shadcn/ui（Radix UI + Tailwind CSS 4）
- **フォーム**: @conform-to/react, @conform-to/zod, @hookform/resolvers
- **カレンダー**: @fullcalendar/react 6.1.19
- **グラフ**: chart.js 4.5.0 + react-chartjs-2
- **その他**: zod, date-fns, lucide-react, sonner
- **テスト**: jest, @testing-library/react, @testing-library/jest-dom

## 開発環境の起動

### Docker Compose を使用（推奨）

プロジェクトルートの`docker-compose.yml`を使用して起動します：

```bash
# プロジェクトルートから
docker-compose up front
```

フロントエンドは `http://localhost:3000` で起動します。

### ローカルで直接起動

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

## 主要な機能・ページ構成

### 認証関連

- `/signin` - サインイン
- `/signup` - サインアップ
- `/onboarding/welcome` - オンボーディング（都道府県設定、トリガー登録、通知設定）

### メイン機能

- `/dashboard` - ダッシュボード（今日のシグナル表示、時間帯別コンテンツ）
- `/morning` - 朝の自己申告フォーム
- `/evening` - 夜の振り返りフォーム
- `/calendar` - カレンダー表示
- `/dailylog/[id]` - 日次ログ詳細
- `/reports/weekly` - 週次レポート（グラフ・統計・トレンド）

### 設定

- `/profile` - プロフィール編集
- `/settings/triggers` - トリガー設定（登録・削除）

### その他

- `/share/score` - スコア共有ページ

## プロジェクト構成

```
front/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 認証関連ページ
│   │   ├── (protected)/        # 認証必須ページ
│   │   ├── api/                # API Routes
│   │   └── page.tsx            # トップページ
│   ├── components/             # 共通UIコンポーネント
│   │   └── ui/                 # shadcn/uiコンポーネント
│   ├── lib/                    # ユーティリティ・ライブラリ
│   │   ├── api/                # API通信関連
│   │   ├── auth/               # 認証関連
│   │   └── schemas/            # Zodスキーマ
│   └── types/                  # TypeScript型定義
├── public/                     # 静的ファイル
└── package.json
```

## テスト

```bash
# テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ
npm run test:coverage
```

## ビルド

```bash
# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

## デプロイ

Vercel にデプロイされています。

## 開発時の注意事項

- サーバーコンポーネントとクライアントコンポーネントの使い分けに注意
- 認証は`next-auth`を使用し、JWT トークンベースでバックエンドと連携
- API 通信は`src/lib/api/api-fetch.ts`の`apiFetch`を使用
- フォームバリデーションは`@conform-to/zod`と`zod`を使用

# Todoクライアント

このリポジトリは Todo アプリのフロントエンドです。AWS Cognito による認証を行い、バックエンド API との通信を通じて Todo の作成・管理を行います。


## 技術スタック

・フレームワーク: Next.js (React)\
・スタイリング: Tailwind CSS\
・認証: AWS Cognito\
・環境変数管理: dotenv\
・デプロイ: Vercel / AWS Amplify


## ディレクトリ構造


```bash
.
├── app/         # アプリケーションの主要コンポーネント
│   ├── components/  # UIコンポーネント
│   ├── constants/   # 定数 (API URL など)
│   ├── hooks/       # カスタムフック
│   ├── pages/       # ルートページ
│   ├── types/       # 型定義
├── aws-exports.ts  # AWS Amplify 設定
└── README.md
```


## 環境構築手順

## リポジトリのクローン
```bash
git clone https://github.com/ogawatakahisa/todo-client-sec.git
```


## 依存感関係のインストール

```bash
npm install
```



## アプリの起動

```bash
npm run dev
```
http://localhost:3000で動作します。


## 主要機能
・ ユーザー認証: AWS Cognito によるログイン・ログアウト管理\
・Todo CRUD 操作: 作成・更新・削除が可能\
・日付フィルタリング: Todo を日付ごとに管理\


## 関連リポジトリ

・バックエンドリポジトリ：[todo-server)](https://github.com/ogawatakahisa/todo-server-sec.git)

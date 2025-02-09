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
├── .env.example    # 環境変数のサンプル
└── README.md
```


## 環境構築手順

## リポジトリのクローン
```bash
git clone https://github.com/ogawatakahisa/todo-client.git
```


## 依存感関係のインストール

```bash
npm install
```

## 環境変数を設定

.env ファイルを作成し、以下の内容を追加:
```bash
NEXT_PUBLIC_API_URL="http://localhost:8080"
```
.env.example を用意し、環境変数のテンプレートを提供しておくと親切。


## アプリの起動

```bash
npm run dev
```
http://localhost:3000で動作します。


## 主要機能
・ ユーザー認証: AWS Cognito によるログイン・ログアウト管理\
・Todo CRUD 操作: 作成・更新・削除が可能\
・日付フィルタリング: Todo を日付ごとに管理\


## 認証（AWS Cognito）
このアプリではAWS CognitoによるJWT認証を利用しています。
apiを利用する際は、リクエストのAuthorizationヘッダーにBearer {token}を付与してください。


### 認証設定
AWS Cognitoの設定方法等は
[動画を再生(yutube))](https://youtu.be/m9ZjW1md_OQ?si=Uqn20gQhwDupt97W)
こちらの14:00から参考に設定ください。


## aws-exports.tsの設定

下記コマンドを実行すると自動で作成されるファイルです。\
CognitのユーザープールID等を設定してください。
```bash
amplify init
```

[バックエンドリポジトリ)](https://github.com/ogawatakahisa/server1.git)の\
src/configに
同じものを設定してください。



## AWSへデプロイ
1. AWS Amplify に GitHub を連携
2. フロントのリポジトリを選択してデプロイ\
   ・環境変数\
   　key＝NEXT_PUBLIC_API_URL\
   　value="http://localhost:8080"\


## 関連リポジトリ

・バックエンドリポジトリ：[todo-server)](https://github.com/ogawatakahisa/server1.git)

# 開発環境セットアップガイド

**最終更新**: 2025-11-06

このガイドに従えば、30分で開発を開始できます。

---

## 📋 事前準備チェックリスト

### 必須アカウント
- [ ] GitHubアカウント（既存）
- [ ] Supabaseアカウント（新規作成）
- [ ] Vercelアカウント（新規作成 or GitHub連携）

### 推奨アカウント
- [ ] Spliceアカウント（音源品質向上のため）

### ローカル環境
- [ ] Node.js 18.17以上
- [ ] npm 9以上
- [ ] Git
- [ ] VS Code（推奨）

---

## 🚀 セットアップ手順（30分）

### Step 1: リポジトリクローン（既に完了）

```bash
cd /Users/gaku/dtm-web-app
```

### Step 2: Supabase プロジェクト作成（10分）

#### 2.1 アカウント作成とログイン
1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントで認証

#### 2.2 Proプランへアップグレード
1. Dashboard → Settings → Billing
2. 「Upgrade to Pro」をクリック
3. クレジットカード情報を入力
4. $25/月 で確定

#### 2.3 新規プロジェクト作成
1. 「New Project」をクリック
2. 設定:
   - Name: `dtm-web-app`
   - Database Password: **強力なパスワードを設定**（メモしておく）
   - Region: `Northeast Asia (Tokyo)` または `Southeast Asia (Singapore)`
3. 「Create new project」をクリック
4. 作成完了まで2-3分待つ

#### 2.4 環境変数を取得
1. Project Settings → API
2. 以下をメモ:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (注意: 秘密鍵)
   ```

### Step 3: データベースセットアップ（5分）

#### 3.1 SQL Editorを開く
Dashboard → SQL Editor → New Query

#### 3.2 マイグレーションSQLを実行
`supabase/migrations/001_initial_schema.sql` の内容をコピペして実行

#### 3.3 Row Level Securityを設定
`supabase/migrations/002_rls_policies.sql` を実行

### Step 4: Storageセットアップ（3分）

#### 4.1 Bucketを作成
1. Storage → Create Bucket
2. Name: `sound-library`
3. Public bucket: **ON**
4. File size limit: 50MB
5. Create

#### 4.2 もう一つ作成（ユーザーアップロード用）
1. Storage → Create Bucket
2. Name: `user-uploads`
3. Public bucket: **OFF**
4. File size limit: 10MB
5. Create

### Step 5: ローカル環境変数設定（2分）

```bash
# プロジェクトルートで実行
cp .env.example .env.local
```

`.env.local` を編集:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Step 6: 依存パッケージインストール（5分）

```bash
npm install
```

初回は5-10分かかる場合があります。

### Step 7: 開発サーバー起動（1分）

```bash
npm run dev
```

http://localhost:3000 にアクセスして動作確認

### Step 8: Vercelデプロイ（5分）

#### 8.1 Vercelアカウント作成
1. https://vercel.com にアクセス
2. 「Sign Up」→ GitHubで認証
3. Hobby（Free）プランのまま

#### 8.2 プロジェクトをインポート
1. 「Add New」→ 「Project」
2. GitHubリポジトリを選択: `Gaku52/dtm-web-app`
3. 「Import」をクリック

#### 8.3 環境変数を設定
Environment Variables に追加:
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
```

#### 8.4 デプロイ
「Deploy」をクリック → 2-3分待つ

完了！ https://dtm-web-app.vercel.app が公開される

---

## 🎵 音源セットアップ（オプション・推奨）

### Splice Sounds アカウント

#### 登録
1. https://splice.com にアクセス
2. 「Sign Up」
3. Sounds プラン: $9.99/月 を選択

#### 音源ダウンロード
1. 「Sounds」タブ
2. 検索: "Piano", "Drums", "Guitar", etc.
3. 気に入ったサンプルを「Download」
4. 月100クレジットまで

#### Supabaseへアップロード
後日、スクリプトで一括アップロード予定

---

## ✅ セットアップ完了チェック

すべてチェックできたらOK:

- [ ] Supabase Pro プロジェクト作成完了
- [ ] データベーステーブル作成完了
- [ ] Storage バケット作成完了
- [ ] ローカル環境変数設定完了
- [ ] `npm install` 成功
- [ ] `npm run dev` でローカルサーバー起動
- [ ] Vercel デプロイ完了
- [ ] デプロイしたURLにアクセスできる
- [ ] （オプション）Splice アカウント作成

---

## 🛠️ トラブルシューティング

### npm install が失敗する

**エラー: EACCES permission denied**
```bash
sudo chown -R $USER /Users/gaku/.npm
npm install
```

**エラー: network timeout**
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

### Supabase 接続エラー

**エラー: Invalid API key**
- `.env.local` の内容を再確認
- `NEXT_PUBLIC_` プレフィックスが正しいか
- 開発サーバーを再起動: `Ctrl+C` → `npm run dev`

**エラー: CORS error**
- Supabase Dashboard → Settings → API
- URL Allowlist に `http://localhost:3000` を追加

### Vercel デプロイが失敗する

**エラー: Build failed**
1. Vercel Dashboard → Project Settings
2. Environment Variables を再確認
3. 「Redeploy」をクリック

**エラー: 環境変数が読み込めない**
- `NEXT_PUBLIC_` プレフィックスがあるか確認
- 環境変数追加後、必ずRedeployが必要

---

## 📞 サポート

### 問題が解決しない場合

1. エラーメッセージの全文をコピー
2. どの手順で発生したか記録
3. 次回のセッションで報告

### 有用なリンク

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Tone.js Docs: https://tonejs.github.io/

---

## 🎯 次のステップ

セットアップが完了したら:

1. **動作確認**
   - ローカルで http://localhost:3000 にアクセス
   - Vercelの本番URLにアクセス

2. **開発開始**
   - `DEVELOPMENT.md` を参照
   - 基本UIの実装から開始

3. **Git workflow**
   ```bash
   git checkout -b feature/auth-page
   # 実装...
   git add .
   git commit -m "Add authentication page"
   git push origin feature/auth-page
   ```

---

**セットアップ完了！開発を始めましょう！** 🚀

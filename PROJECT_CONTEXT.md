# DTM Web App - プロジェクトコンテキスト

**最終更新**: 2025-11-06
**現在のフェーズ**: 設計完了 / 実装準備中

> このファイルはプロジェクトの「現在地」を示します。常に最新に保たれます。

---

## 📍 現在の状態

### 完了したこと ✅
- [x] プロジェクト設計（100%）
- [x] 技術スタック決定
- [x] データベーススキーマ設計
- [x] UI設計（100+コンポーネント）
- [x] 音源戦略決定
- [x] 開発環境準備
- [x] ドキュメント整備（12個）
- [x] 会話ログシステム構築

### 次にやること 📋
- [ ] Supabase Pro契約
- [ ] データベース作成
- [ ] ローカル環境構築
- [ ] Vercelデプロイ
- [ ] 認証ページ実装

---

## 🛠️ 技術スタック（確定版）

### Frontend
```typescript
Framework: Next.js 15 (App Router)
Language: TypeScript 5
Styling: Tailwind CSS + shadcn/ui
Animation: Framer Motion
State: Zustand
```

### Audio Engine
```typescript
Core: Web Audio API
Library: Tone.js 14.8+
Waveform: WaveSurfer.js 7.7+
```

### Backend
```
Database: Supabase PostgreSQL (Pro: $25/月)
Storage: Supabase Storage (100GB)
Auth: Supabase Authentication
```

### Deployment
```
Hosting: Vercel (Free プラン)
CDN: Cloudflare (via Supabase)
```

---

## 💰 予算

### 月額コスト（確定）
```
Supabase Pro:    $25/月 (~¥3,500) ✅ 必須
Splice Sounds:   $10/月 (~¥1,400) ✅ 推奨
Vercel Free:      $0/月            ✅ 十分
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
合計:            $35/月 (~¥5,000)

予備費:          ~¥5,000/月
```

### アップグレード条件
- **Vercel Pro ($20/月)**: 月間20,000ユーザー超 または 商用化時

---

## 📁 プロジェクト構造

```
dtm-web-app/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui
│   │   └── editor/      # DTM editor
│   ├── lib/             # Core libraries
│   │   ├── audio/       # Audio engine
│   │   ├── supabase/    # Database
│   │   └── hooks/       # Custom hooks
│   └── types/           # TypeScript types
├── supabase/
│   └── migrations/      # Database migrations
├── docs/
│   └── logs/            # Session logs
└── public/              # Static assets
```

---

## 📚 重要なドキュメント

| ドキュメント | 用途 | 状態 |
|------------|------|------|
| README.md | プロジェクト概要 | ✅ |
| PROJECT_CONTEXT.md | 現在地（このファイル） | ✅ |
| SPEC.md | 仕様書 | ✅ |
| ARCHITECTURE.md | システム設計 | ✅ |
| UI_DESIGN.md | UI設計 | ✅ |
| SOUND_STRATEGY.md | 音源戦略 | ✅ |
| SETUP.md | セットアップガイド | ✅ |
| DEVELOPMENT.md | 開発フロー | ✅ |
| .clauderc | 自動動作ルール | ✅ |

---

## 🗄️ データベース

### テーブル一覧
```sql
users              -- ユーザープロフィール
projects           -- プロジェクト（楽曲）
tracks             -- トラック（最大8個/プロジェクト）
notes              -- MIDIノート
effects            -- エフェクトチェーン
automation         -- オートメーション（v2）
project_snapshots  -- 自動保存履歴
```

### マイグレーション状態
- [x] 001_initial_schema.sql - 準備完了
- [x] 002_rls_policies.sql - 準備完了
- [ ] 実行 - 明日実施

---

## 🎨 UI コンポーネント

### 実装優先度

**Phase 1 (Week 1-2):**
- [ ] AppShell, Header, Toolbar
- [ ] TrackList, TrackItem
- [ ] PianoRoll (基本グリッド)
- [ ] Transport Controls

**Phase 2 (Week 3-4):**
- [ ] ノート配置・編集
- [ ] ツール切り替え
- [ ] グリッド・スナップ
- [ ] VelocityEditor

**Phase 3 (Week 5-6):**
- [ ] Inspector Panel
- [ ] Mixer View
- [ ] Waveform Display

---

## 🎵 音源戦略

### 実装方針
```
Phase 1 (MVP):
  - Web Audio Oscillator（シンセ4種）
  - ファイルサイズ: 0MB

Phase 2:
  - サンプル音源追加（Piano, Drums, etc.）
  - Supabase Storageから配信
  - 総容量: 500MB

Phase 3:
  - 20種類以上の楽器
  - Full/Multi Sampling
  - 総容量: 80-100GB
```

---

## 🎯 マイルストーン

### Week 1-2: 音が鳴る ✅ 設計完了
- [x] Day 0: 設計フェーズ完了
- [ ] Day 1: 環境構築
- [ ] Day 5: 最初の音が鳴る

### Week 3-4: 作曲できる
- [ ] ノート編集機能
- [ ] 複数トラック対応
- [ ] 保存・読込機能

### Week 5-6: 本格的に使える
- [ ] ミキサー
- [ ] エフェクト
- [ ] エクスポート

### Week 7-8: 完成
- [ ] 最適化
- [ ] テスト
- [ ] 公開

---

## 🔧 開発環境

### 必須ツール
- Node.js 18.17+
- npm 9+
- Git
- VS Code（推奨）

### VS Code 拡張機能
- Prettier
- ESLint
- Tailwind CSS IntelliSense
- TypeScript
- Error Lens

---

## 📝 最新のログ

**最新セッション**: 2025-11-06-session-01
**ファイル**: `docs/logs/2025-11-06-session-01.md`

**次回のアクション**:
1. Supabase Pro契約
2. データベース作成
3. ローカル環境構築
4. 認証ページ実装

---

## 🚀 次回セッション開始時の確認事項

### 必ずやること
1. [ ] `docs/logs/[最新].md` を読む
2. [ ] 前回の「次回のアクション」を確認
3. [ ] `git pull origin main` で最新を取得
4. [ ] このファイル（PROJECT_CONTEXT.md）を確認

### セッション終了時にやること
1. [ ] 今日のログを作成
2. [ ] PROJECT_CONTEXT.md を更新
3. [ ] Git commit & push

---

## 💡 重要な設計決定

### なぜこの技術スタックなのか
- **Next.js 15**: 最新、App Router、高速
- **Supabase**: バックエンド構築不要、リアルタイム、認証
- **Tone.js**: 音楽専用ライブラリ、簡単、高機能
- **Zustand**: 軽量、シンプル、高速

### なぜこのアーキテクチャなのか
- **Canvas描画**: 10,000ノート対応、60FPS
- **Supabase Storage**: 100GB、高速CDN、無制限楽器
- **Row Level Security**: セキュア、マルチテナント対応

---

## 🎼 音楽への情熱

このプロジェクトは単なる技術的挑戦ではありません。

**ユーザーの言葉:**
> 「私がここ前の進捗を叩き出すとは誰も思っていないと思います。私はやるぞ！！！」

**私たちのコミットメント:**
- 技術的に最高のものを作る
- 音楽制作者が本当に使いたくなるものを作る
- 細部まで妥協しない
- 何度でも改善する

---

**このファイルは常に最新に保たれます。セッションごとに更新されます。**

---

## 📞 緊急時の参照

### 問題が発生したら
1. `docs/logs/` で過去の同様の問題を検索
2. `DEVELOPMENT.md` のトラブルシューティング参照
3. 該当する設計ドキュメントを再確認

### 設計を変更したい場合
1. 理由を明確にする
2. 影響範囲を確認
3. 設計ドキュメントを更新
4. ログに記録

---

**最終更新**: 2025-11-06
**次回更新予定**: 2025-11-07（Day 1終了時）

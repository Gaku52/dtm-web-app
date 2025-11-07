# コスト管理ガイド

**最終更新**: 2025-11-07

このドキュメントでは、DTM Web Appの従量課金を制限する方法を説明します。

---

## 💰 コスト構造

### 月額固定費
```
Supabase Pro: $25/月
```

### 従量課金（Pro プラン超過時）

| リソース | 含まれる量 | 超過時の料金 |
|---------|-----------|------------|
| Database | 8GB | $0.125/GB |
| Storage | 100GB | $0.021/GB |
| データ転送 | 250GB | $0.09/GB |
| MAU | 100,000 | $0.00325/1000人 |

---

## 🛡️ コスト制限設定（必須）

### ✅ 1. Spending Cap（支出上限）

**最も重要な設定！**

**設定場所:**
- Supabase Dashboard → Organization Settings → Billing → Spend Cap

**推奨値:**
```
月額上限: $50
（Proプラン$25 + 従量課金上限$25）
```

**効果:**
- 上限到達時、自動的にサービス停止
- 予期しない請求を完全に防ぐ

**注意:**
- サービスが停止する可能性がある
- ユーザー体験に影響する可能性

---

### ✅ 2. Usage Alerts（使用量アラート）

**設定場所:**
- Organization Settings → Billing → Usage alerts

**推奨設定:**
```
アラート1: $30 （75%到達）
アラート2: $40 （90%到達）
アラート3: $45 （95%到達）
```

**効果:**
- メールで通知
- 上限到達前に対策可能

---

### ✅ 3. Storage Quota（ストレージ制限）

**設定場所:**
- Storage → バケット → Settings

**sound-library バケット:**
```
File size limit: 50MB/ファイル
推奨合計上限: 80GB（手動管理）
```

**user-uploads バケット:**
```
File size limit: 10MB/ファイル
推奨合計上限: 5GB（手動管理）
```

---

### ✅ 4. Database Size Monitor

**定期的に確認:**
```sql
-- データベースサイズ確認
SELECT
  pg_size_pretty(pg_database_size('postgres')) as database_size;

-- テーブルごとのサイズ
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📊 コスト予測

### Phase 1 (MVP - 最初の2週間)
```
データベース: 100MB
Storage: 0MB（シンセのみ）
転送量: 5GB/月
━━━━━━━━━━━━━━━━━━━
予想コスト: $25/月（固定のみ）
```

### Phase 2 (音源追加 - Week 3-4)
```
データベース: 500MB
Storage: 500MB
転送量: 50GB/月
━━━━━━━━━━━━━━━━━━━
予想コスト: $25/月（範囲内）
```

### Phase 3 (本格運用 - Week 5+)
```
データベース: 2GB
Storage: 80GB
転送量: 150GB/月
━━━━━━━━━━━━━━━━━━━
予想コスト: $25/月（範囲内）
```

### スケール後（1000ユーザー）
```
データベース: 5GB
Storage: 80GB
転送量: 200GB/月
MAU: 1000人
━━━━━━━━━━━━━━━━━━━
予想コスト: $25-30/月
```

---

## ⚠️ コスト超過のリスク

### 高リスク項目

**1. Storage（ストレージ）**
- リスク: ユーザーアップロード音源の無制限追加
- 対策: ファイルサイズ制限 + 合計容量監視

**2. データ転送**
- リスク: 大量の音源ダウンロード
- 対策: CDNキャッシュ + ファイル圧縮

**3. Database**
- リスク: 大量のノートデータ蓄積
- 対策: 古いスナップショット自動削除

---

## 🔧 アプリケーション側の制限

### 実装すべき制限

**1. ファイルアップロード制限**
```typescript
// src/lib/upload-limits.ts
export const UPLOAD_LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  maxFilesPerUser: 100,
  maxTotalSizePerUser: 500 * 1024 * 1024, // 500MB
}
```

**2. プロジェクト数制限**
```typescript
// ユーザーあたりの最大プロジェクト数
export const MAX_PROJECTS_PER_USER = 50

// プロジェクトあたりの最大ノート数
export const MAX_NOTES_PER_PROJECT = 10000
```

**3. Rate Limiting**
```typescript
// API呼び出し制限
export const RATE_LIMITS = {
  saveProject: '10 requests per minute',
  uploadFile: '5 requests per minute',
  createProject: '20 requests per hour',
}
```

---

## 📈 モニタリング

### 毎週確認すべき項目

**Supabase Dashboard:**
1. **Billing** → Current usage
2. **Database** → Size
3. **Storage** → Usage by bucket
4. **API** → Request count

### 月次レビュー

**確認項目:**
- [ ] 実際のコストは予算内か
- [ ] 各リソースの使用率
- [ ] 異常なスパイクがないか
- [ ] アラートは適切か

---

## 🚨 緊急時の対応

### コストが急増した場合

**1. 即座に確認:**
```
- どのリソースが増えているか
- いつから増加したか
- 原因は何か（攻撃？バグ？）
```

**2. 一時的な対策:**
```
- Spending Cap を下げる
- 問題のあるバケットを非公開化
- Rate Limit を厳しくする
```

**3. 恒久対策:**
```
- バグ修正
- セキュリティ強化
- アーキテクチャ見直し
```

---

## ✅ チェックリスト

### 初期設定（今日実施）
- [ ] Spending Cap 設定（$50）
- [ ] Usage Alerts 設定（$30, $40, $45）
- [ ] Storage バケット制限設定
- [ ] このドキュメントを理解

### 開発時（常時）
- [ ] アップロード制限を実装
- [ ] Rate Limiting 実装
- [ ] ファイルサイズを監視
- [ ] 不要なデータを定期削除

### 運用時（毎週）
- [ ] Billing ダッシュボード確認
- [ ] 異常なスパイクがないか確認
- [ ] Storage 容量確認
- [ ] Database サイズ確認

---

## 💡 コスト最適化のヒント

### Storage
- 音源ファイルは圧縮（MP3 128kbps）
- 不要なファイルは定期削除
- CDN キャッシュを活用

### Database
- 古いスナップショット自動削除（30日以上）
- インデックス最適化
- 不要なログを削除

### データ転送
- 音源ファイルの段階的ロード
- クライアントサイドでのキャッシュ
- 圧縮転送

---

**Spending Cap を設定すれば、予期しない請求は発生しません！** 🔒

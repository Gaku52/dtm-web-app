# DTM Web App - コーディング規約

## 外部ライブラリのインポート

### Tone.js の使用方法

**問題**: Tone.jsはNext.js 15のWebpack設定と互換性の問題があり、named importやnamespace importが正しく動作しません。

**解決策**: 以下の2つの方法のいずれかを使用:

#### 方法1: 直接名前付きインポート (推奨)
```typescript
import { PolySynth, Synth, Frequency, start, getTransport } from 'tone'

// 使用例
const synth = new PolySynth(Synth).toDestination()
const freq = Frequency(60, 'midi').toFrequency()
await start()
const transport = getTransport()
```

#### 方法2: 動的インポート（SSR回避が必要な場合）
```typescript
useEffect(() => {
  import('tone').then(({ PolySynth, Synth }) => {
    // 使用
  })
}, [])
```

### 避けるべきパターン

❌ **使用禁止**: `import * as Tone from 'tone'`
- Webpackがモジュールを空のオブジェクトとして解決
- 結果: `Tone.PolySynth is not a constructor`

❌ **使用禁止**: デフォルトインポート
```typescript
import Tone from 'tone'  // 機能しない
```

## Next.js設定

### Tone.jsのためのWebpack設定
```javascript
// next.config.js
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  experimental: {
    esmExternals: true
  }
}
```

## デバッグ方法

### モジュールの確認
```typescript
useEffect(() => {
  import('tone').then((ToneModule) => {
    console.log('[DEBUG] Keys:', Object.keys(ToneModule))
    console.log('[DEBUG] PolySynth:', ToneModule.PolySynth)
  })
}, [])
```

期待される出力:
- ✅ 正常: `Keys: ['PolySynth', 'Synth', 'Frequency', ...]`
- ❌ 異常: `Keys: []` または `PolySynth: undefined`

## 一般的なルール

1. **クライアントコンポーネント**: 音声機能には `'use client'` ディレクティブが必須
2. **ユーザーインタラクション**: `await start()` は必ずユーザーアクション内で実行
3. **クリーンアップ**: useEffectのreturnで `.dispose()` と transport.stop() を実行

## トラブルシューティング

### エラー: "is not exported from 'tone'"
1. .nextディレクトリを削除
2. node_modulesを再インストール
3. 名前付きインポートを使用していることを確認

### エラー: "is not a constructor"
1. importの方法を確認
2. モジュールのキーをデバッグログで確認
3. 必要に応じてCDN経由の使用を検討

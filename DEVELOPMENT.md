# 開発ワークフローガイド

**最終更新**: 2025-11-06

開発の進め方、ブランチ戦略、コーディング規約などをまとめたガイドです。

---

## 📋 目次

1. [日々の開発フロー](#日々の開発フロー)
2. [ブランチ戦略](#ブランチ戦略)
3. [コーディング規約](#コーディング規約)
4. [コミットメッセージ](#コミットメッセージ)
5. [開発ツール](#開発ツール)
6. [デバッグ方法](#デバッグ方法)

---

## 日々の開発フロー

### 開発セッションの基本フロー

```
1. 目標設定 (5分)
   ↓
2. ブランチ作成
   ↓
3. 実装 (1-3時間)
   ↓
4. テスト・動作確認
   ↓
5. コミット
   ↓
6. プッシュ
   ↓
7. デモ・レビュー
   ↓
8. 次回の計画
```

### 具体例

```bash
# 1. 最新のmainを取得
git checkout main
git pull origin main

# 2. 新しいブランチを作成
git checkout -b feature/piano-roll-grid

# 3. 実装...
# (コーディング)

# 4. 動作確認
npm run dev
# → http://localhost:3000 で確認

# 5. 変更をステージング
git add .

# 6. コミット
git commit -m "feat: add piano roll grid rendering"

# 7. プッシュ
git push origin feature/piano-roll-grid

# 8. mainにマージ（レビュー後）
git checkout main
git merge feature/piano-roll-grid
git push origin main
```

---

## ブランチ戦略

### ブランチの種類

```
main
  ├─ feature/piano-roll-grid      (新機能)
  ├─ feature/track-controls        (新機能)
  ├─ fix/note-deletion-bug         (バグ修正)
  └─ refactor/audio-engine         (リファクタリング)
```

### ブランチ命名規則

```
feature/機能名     - 新機能の追加
fix/バグ内容       - バグ修正
refactor/対象     - リファクタリング
docs/ドキュメント  - ドキュメント更新
style/対象        - スタイル修正のみ
test/テスト名     - テストの追加
```

### 例

```bash
# 良い例
git checkout -b feature/velocity-editor
git checkout -b fix/audio-latency
git checkout -b refactor/piano-roll-canvas

# 悪い例
git checkout -b new-feature
git checkout -b fix
git checkout -b update
```

---

## コーディング規約

### TypeScript

#### ファイル構成

```typescript
// 1. Import statements
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

// 2. Types / Interfaces
interface PianoRollProps {
  trackId: string;
  notes: Note[];
}

// 3. Constants
const GRID_SIZE = 40;
const KEY_HEIGHT = 12;

// 4. Helper functions
function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// 5. Main component
export function PianoRoll({ trackId, notes }: PianoRollProps) {
  // Hooks
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    // ...
  }, [trackId]);

  // Event handlers
  const handleNoteClick = (noteId: string) => {
    // ...
  };

  // Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

#### 命名規則

```typescript
// Components: PascalCase
export function PianoRoll() {}

// Functions: camelCase
function calculateNotePosition() {}

// Constants: UPPER_SNAKE_CASE
const MAX_TRACKS = 8;

// Types/Interfaces: PascalCase
interface Track {}
type NoteId = string;

// Variables: camelCase
const selectedNotes = [];
const isPlaying = false;
```

#### Type vs Interface

```typescript
// Interface: オブジェクトの形を定義
interface Track {
  id: string;
  name: string;
}

// Type: より柔軟な型定義
type NoteId = string;
type TrackOrNull = Track | null;
type EventHandler = (event: MouseEvent) => void;
```

### React Components

#### Functional Components（推奨）

```typescript
// ✅ Good
export function PianoRoll({ notes }: Props) {
  return <div>{/* ... */}</div>;
}

// ❌ Avoid
export const PianoRoll: React.FC<Props> = ({ notes }) => {
  return <div>{/* ... */}</div>;
};
```

#### Hooks の順序

```typescript
function Component() {
  // 1. State hooks
  const [state, setState] = useState();

  // 2. Context hooks
  const context = useContext(MyContext);

  // 3. Ref hooks
  const ref = useRef();

  // 4. Custom hooks
  const data = useCustomHook();

  // 5. Effects
  useEffect(() => {}, []);

  // 6. Event handlers
  const handleClick = () => {};

  // 7. Render
  return <div />;
}
```

### CSS / Tailwind

#### Class 順序（Prettier自動整形）

```tsx
<div
  className={cn(
    // Layout
    'flex items-center justify-between',
    // Spacing
    'p-4 gap-2',
    // Sizing
    'w-full h-12',
    // Typography
    'text-sm font-medium',
    // Colors
    'bg-gray-900 text-white',
    // Borders
    'border border-gray-700 rounded',
    // Effects
    'hover:bg-gray-800 transition-colors',
    // Conditional
    isActive && 'bg-blue-500'
  )}
/>
```

#### 条件付きクラス

```typescript
// ✅ Good: cn() を使用
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)} />

// ❌ Avoid: 文字列結合
<div className={`base ${isActive ? 'active' : ''}`} />
```

---

## コミットメッセージ

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

```
feat:     新機能
fix:      バグ修正
docs:     ドキュメント
style:    コードスタイル（動作に影響なし）
refactor: リファクタリング
perf:     パフォーマンス改善
test:     テスト追加・修正
chore:    雑務（ビルド、設定など）
```

### 例

```bash
# Good
git commit -m "feat: add piano roll grid rendering"
git commit -m "fix: resolve audio latency issue"
git commit -m "refactor: extract note calculation logic"

# Better (with body)
git commit -m "feat: add velocity editor

- Add velocity bar display
- Implement drag to adjust velocity
- Connect to note state

Closes #123"
```

---

## 開発ツール

### VS Code 推奨拡張機能

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens"
  ]
}
```

### VS Code 設定（.vscode/settings.json）

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### 便利なコマンド

```bash
# 型チェック
npm run type-check

# Lintチェック
npm run lint

# フォーマット
npm run format

# 開発サーバー（ホットリロード）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー（ローカル確認）
npm run start
```

---

## デバッグ方法

### ブラウザ DevTools

```javascript
// Console logging
console.log('Debug:', variable);
console.table(arrayOfObjects);
console.time('operation');
// ... code
console.timeEnd('operation');

// Debugger
debugger; // ← ここでブレークポイント
```

### React DevTools

1. Chrome拡張機能インストール
2. DevTools → Components タブ
3. コンポーネントのStateを確認

### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools((set) => ({
    // ... state
  }))
);
```

### Supabase エラー確認

```typescript
const { data, error } = await supabase.from('projects').select();

if (error) {
  console.error('Supabase Error:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}
```

### パフォーマンス測定

```typescript
// React Profiler
import { Profiler } from 'react';

<Profiler id="PianoRoll" onRender={onRenderCallback}>
  <PianoRoll />
</Profiler>

// Performance API
performance.mark('start');
// ... code
performance.mark('end');
performance.measure('operation', 'start', 'end');
console.log(performance.getEntriesByName('operation'));
```

---

## トラブルシューティング

### よくあるエラー

#### 1. Hydration Error

```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**原因:** サーバーとクライアントで異なるHTMLが生成される

**解決策:**
```typescript
// ✅ Good: useEffect で初期化
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

// ❌ Avoid: ランダム値やDate.now()を直接使用
```

#### 2. Cannot read property of undefined

```typescript
// ❌ Bad
const name = user.profile.name;

// ✅ Good: Optional chaining
const name = user?.profile?.name;

// ✅ Better: Default value
const name = user?.profile?.name ?? 'Anonymous';
```

#### 3. Too many re-renders

**原因:** useEffect の依存配列が不適切

```typescript
// ❌ Bad: 無限ループ
useEffect(() => {
  setCount(count + 1);
}, [count]);

// ✅ Good: 適切な依存配列
useEffect(() => {
  // 初回のみ実行
}, []);
```

---

## コードレビューチェックリスト

### Before Commit

- [ ] コードが動作する
- [ ] console.logを削除
- [ ] 型エラーがない (`npm run type-check`)
- [ ] Lintエラーがない (`npm run lint`)
- [ ] フォーマット済み (`npm run format`)
- [ ] 不要なコメントを削除

### Before Push

- [ ] 機能が完全に動作する
- [ ] エラーハンドリングを実装
- [ ] レスポンシブデザイン確認
- [ ] パフォーマンス問題がない
- [ ] コミットメッセージが適切

---

## 次のステップ

開発の準備が整いました！

1. `SETUP.md` を参照して環境構築
2. 機能実装を開始
3. このガイドを参照しながら開発

**良いコードを書きましょう！** 🚀

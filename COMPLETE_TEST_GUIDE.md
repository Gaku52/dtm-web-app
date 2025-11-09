# DTM Web App - 完全な操作＆テストガイド

## 🎯 目的

このガイドに従って、**ログインから音が鳴るまでの全ての操作**を順番に実行してください。

---

## 📝 準備

### 1. 開発サーバーを起動

```bash
npm run dev
```

ターミナルに以下のように表示されることを確認：
```
✓ Ready in 2s
○ Local:        http://localhost:3000
```

### 2. ブラウザの開発者ツールを開く

- **Chrome/Edge**: F12 または Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows)
- **Consoleタブ**を開いておく（ログを確認するため）

---

## 🚀 完全な操作フロー

### ステップ1: ログイン

1. ブラウザで `http://localhost:3000/auth/login` を開く

2. ログイン情報を入力：
   - **メールアドレス**: `gan.hmhm333@gmail.com`
   - **パスワード**: `password123`

3. 「ログイン」ボタンをクリック

4. **✅ 確認事項:**
   - ダッシュボードページ (`http://localhost:3000/dashboard`) にリダイレクトされる
   - ページ上部に「DTM Web App」と表示される
   - ブラウザコンソールに以下のログが表示される（user recordがない場合のみ）：
     ```
     Creating user record for: gan.hmhm333@gmail.com
     ✅ User record created successfully
     ```

### ステップ2: プロジェクト作成

1. ダッシュボードで「新規プロジェクト」ボタンをクリック

2. **✅ 確認事項:**
   - エディタページ (`http://localhost:3000/editor/[ランダムなID]`) にリダイレクトされる
   - 画面上部に「DTM Web App」が表示される
   - 左側に「トラック」セクションが表示される
   - 右側にグレーのキャンバスエリア（ピアノロール）が表示される
   - ブラウザコンソールに以下のログが表示される：
     ```
     🎵 Initializing Audio Engine...
     ✅ Audio Engine initialized successfully
     Synth: PolySynth {...}
     Tempo: 120 BPM
     ```

### ステップ3: トラック追加

1. 左サイドバーの「トラックを追加」ボタンをクリック

2. **✅ 確認事項:**
   - 「トラック 1」が左サイドバーに表示される
   - トラックが選択状態（背景が少し明るいグレー）になる
   - トラックに「M」「S」ボタンが表示される
   - トラック情報に「piano」と「80%」が表示される

### ステップ4: ノートをクリックして音を鳴らす（🔴 最重要！）

1. 右側のピアノロール（キャンバスエリア）の**中央あたり**をクリック

2. **✅ 期待される結果:**
   - **🎵 音が鳴る！**（ピアノの「ド」に近い音）
   - クリックした位置に**青い矩形**（ノート）が表示される
   - ブラウザコンソールに以下のログが順番に表示される：
     ```
     🎹 Piano Roll: Playing note {pitch: 60, velocity: 100}
     🎵 Tone.js context started
     🎵 Playing note: MIDI 60 (261.63Hz), duration: 0.5s, velocity: 100
     ✅ Note played successfully
     ```

3. ピアノロールの**異なる高さ**をクリック

4. **✅ 期待される結果:**
   - **異なる音程の音が鳴る**
   - 上の方をクリック → 低い音
   - 下の方をクリック → 高い音
   - それぞれのクリックで青い矩形が表示される

### ステップ5: 音量が変わることを確認（オプション）

1. `/test-audio` ページを別タブで開く：
   ```
   http://localhost:3000/test-audio
   ```

2. 「4. 音量テスト」セクションで各ボタンをクリック

3. **✅ 期待される結果:**
   - 音量 20%ボタン → 小さい音
   - 音量 50%ボタン → 中くらいの音
   - 音量 80%ボタン → 大きい音
   - 音量 100%ボタン → 最大音量

---

## ✅ 成功の基準

以下がすべて確認できれば、**DTM機能は正常に動作しています**：

- [x] ログインできた
- [x] ダッシュボードが表示された
- [x] プロジェクト作成できた
- [x] エディタページに移動できた
- [x] トラックを追加できた
- [x] ピアノロールでノートをクリックできた
- [x] **ピアノロールクリック時に音が鳴った** 🎵
- [x] **異なる位置で異なる音程が鳴った** 🎵
- [x] ブラウザコンソールに 🎵 と ✅ のログが表示された
- [x] エラーログ（❌）が表示されていない

---

## 🐛 もし音が鳴らない場合

### チェック1: システム音量
- コンピューターの音量がミュートになっていないか
- ヘッドフォン/スピーカーが接続されているか
- ブラウザのタブがミュートになっていないか

### チェック2: ブラウザコンソールのエラー
F12を押して開発者ツールを開き、Consoleタブを確認：

**❌ エラーがある場合の例:**
```
❌ Synth not initialized
❌ Error playing note: ...
```

**✅ 正常な場合の例:**
```
🎵 Initializing Audio Engine...
✅ Audio Engine initialized successfully
🎹 Piano Roll: Playing note {pitch: 60, velocity: 100}
🎵 Tone.js context started
✅ Note played successfully
```

### チェック3: Audio Engineの初期化
エディタページを開いた直後に、コンソールに以下が表示されるはずです：
```
🎵 Initializing Audio Engine...
✅ Audio Engine initialized successfully
```

これが表示されない場合は、ページをリロード（F5）してください。

### チェック4: データベース接続
プロジェクト作成やトラック追加でエラーが出る場合：
1. Supabaseの接続情報（`.env.local`）が正しいか確認
2. ブラウザコンソールでSupabaseエラーが出ていないか確認

---

## 📊 コンソールログの見方

### 正常なログの流れ

#### エディタページ表示時
```
🎵 Initializing Audio Engine...
✅ Audio Engine initialized successfully
Synth: PolySynth {...}
Tempo: 120 BPM
```

#### ノートクリック時
```
🎹 Piano Roll: Playing note {pitch: 60, velocity: 100}
🎵 Tone.js context started
🎵 Playing note: MIDI 60 (261.63Hz), duration: 0.5s, velocity: 100
✅ Note played successfully
```

### エラーログの例

#### Synthが初期化されていない
```
❌ Synth not initialized
```
→ ページをリロードしてください

#### Tone.js起動エラー
```
❌ Error playing note: Error: ...
```
→ ブラウザの音声出力設定を確認してください

---

## 🎯 テスト結果の報告フォーマット

テストが完了したら、以下の形式で結果を報告してください：

```
【テスト環境】
- ブラウザ: Chrome 120 (例)
- OS: macOS 14.2 (例)

【テスト結果】
✅ ログイン成功
✅ プロジェクト作成成功
✅ トラック追加成功
✅ ノートクリックで音が鳴った 🎵
✅ 異なる音程が確認できた 🎵
✅ コンソールログが正常

【コンソールログ（最後の10行）】
(貼り付け)

【その他】
(気づいた点があれば)
```

---

## 🎉 すべて成功した場合

**おめでとうございます！** DTM Web Appの基本機能が正常に動作しています。

次のステップ：
1. コードをコミット&プッシュ
2. 再生/停止機能の実装
3. ノート編集機能（ドラッグ&ドロップ）
4. エフェクト機能
5. 音声エクスポート機能

まずは**音が鳴ることを確認してから**、次の機能開発に進みましょう！🎵

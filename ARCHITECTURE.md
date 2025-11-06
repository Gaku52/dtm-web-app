# システムアーキテクチャ設計書

**作成日**: 2025-11-06
**バージョン**: 1.0.0

---

## プロジェクトビジョン

**「Supabase + Vercel + GitHub だけで、プロレベルの作曲ができる」**

- 5分以上の楽曲制作が可能
- リアルタイムで音を聞きながら編集
- 波形をビジュアル表示
- BPM自由調整
- 直感的で美しいUI

---

## 1. システム構成図

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                      │
│  ┌───────────────────────────────────────────────┐ │
│  │         Next.js Frontend (Vercel)             │ │
│  │  ┌─────────────┐  ┌──────────────────────┐   │ │
│  │  │  UI Layer   │  │   Audio Engine       │   │ │
│  │  │  - Piano    │  │   - Web Audio API    │   │ │
│  │  │    Roll     │  │   - Tone.js          │   │ │
│  │  │  - Timeline │  │   - Waveform         │   │ │
│  │  │  - Controls │  │   - Real-time Play   │   │ │
│  │  └─────────────┘  └──────────────────────┘   │ │
│  └───────────────────────────────────────────────┘ │
│                         ↕                           │
│                  HTTPS / REST API                   │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│              Supabase (Backend)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ PostgreSQL   │  │   Storage    │  │   Auth   │ │
│  │  - Projects  │  │  - Sounds    │  │  - Users │ │
│  │  - Tracks    │  │  - Samples   │  │          │ │
│  │  - Notes     │  │    (Audio)   │  │          │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│               GitHub Repository                     │
│  - Source Code                                      │
│  - Configuration                                    │
│  - Documentation                                    │
└─────────────────────────────────────────────────────┘
```

---

## 2. 技術スタック（確定版）

### 2.1 フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Next.js** | 15.x | フレームワーク |
| **React** | 19.x | UIライブラリ |
| **TypeScript** | 5.x | 型安全性 |
| **Tailwind CSS** | 3.x | スタイリング |
| **shadcn/ui** | latest | UIコンポーネント |
| **Framer Motion** | latest | アニメーション |

### 2.2 音声処理

| 技術 | 用途 | 重要度 |
|------|------|--------|
| **Tone.js** | 音源管理、タイムライン、エフェクト | ★★★★★ |
| **Web Audio API** | 低レベル音声処理 | ★★★★★ |
| **WaveSurfer.js** | 波形表示 | ★★★★☆ |
| **Pizzicato.js** | エフェクト処理（オプション） | ★★☆☆☆ |

### 2.3 描画・可視化

| 技術 | 用途 |
|------|------|
| **Canvas API** | ピアノロール描画 |
| **SVG** | UI要素、アイコン |
| **Konva.js** | Canvas描画ライブラリ（検討中） |

### 2.4 バックエンド

| サービス | プラン | 用途 |
|---------|-------|------|
| **Supabase** | Pro ($25/月) | データベース、認証、ストレージ |
| **Vercel** | Pro ($20/月) | ホスティング、デプロイ |

**合計コスト: $45/月 (約6,500円)**

---

## 3. Supabase 構成（有料プラン）

### 3.1 Pro プランのスペック

- **データベース**: 8GB（十分な容量）
- **ストレージ**: 100GB（音源データに使用）
- **転送量**: 250GB/月
- **同時接続**: 無制限
- **Row Level Security**: 有効

### 3.2 データベース設計

#### テーブル構成

##### `users` テーブル（Supabase Auth連携）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

##### `projects` テーブル
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tempo INTEGER DEFAULT 120,  -- BPM
  time_signature TEXT DEFAULT '4/4',
  key TEXT DEFAULT 'C',
  duration FLOAT DEFAULT 300.0,  -- 秒単位（5分 = 300秒）
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_opened_at TIMESTAMP,
  is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);
```

##### `tracks` テーブル
```sql
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instrument TEXT NOT NULL,  -- 'piano', 'guitar', 'drums', etc.
  color TEXT DEFAULT '#3B82F6',
  volume INTEGER DEFAULT 80,  -- 0-100
  pan INTEGER DEFAULT 0,      -- -100 (L) to 100 (R)
  muted BOOLEAN DEFAULT FALSE,
  solo BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tracks_project_id ON tracks(project_id);
CREATE INDEX idx_tracks_order ON tracks(project_id, order_index);
```

##### `notes` テーブル
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  pitch INTEGER NOT NULL,        -- MIDI note number (0-127)
  start_time FLOAT NOT NULL,     -- 開始時間（秒単位）
  duration FLOAT NOT NULL,       -- 長さ（秒単位）
  velocity INTEGER DEFAULT 100,  -- 0-127
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_track_id ON notes(track_id);
CREATE INDEX idx_notes_time ON notes(track_id, start_time);

-- パフォーマンス最適化: 時間範囲検索用
CREATE INDEX idx_notes_time_range ON notes(track_id, start_time, duration);
```

##### `project_snapshots` テーブル（自動保存用）
```sql
CREATE TABLE project_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,  -- プロジェクト全体のスナップショット
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_snapshots_project ON project_snapshots(project_id, created_at DESC);

-- 自動削除: 30日以上前のスナップショットは削除
CREATE OR REPLACE FUNCTION delete_old_snapshots()
RETURNS void AS $$
BEGIN
  DELETE FROM project_snapshots
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Supabase Storage 構成

#### Bucket: `sound-library`（公開）

```
sound-library/
├── piano/
│   ├── C2.mp3
│   ├── D2.mp3
│   ├── E2.mp3
│   └── ... (全音程)
├── acoustic-guitar/
├── electric-guitar/
├── bass/
├── drums/
│   ├── kick.mp3
│   ├── snare.mp3
│   └── ...
├── strings/
├── brass/
└── synth/
```

**容量見積もり:**
- 1楽器あたり: 3-5MB（Multi Sampling）
- 20楽器: 60-100MB
- 余裕を持って: 100GB（将来の拡張用）

#### Bucket: `user-uploads`（プライベート）

```
user-uploads/
└── {user_id}/
    ├── custom-sample-1.mp3
    └── custom-sample-2.mp3
```

**用途:**
- v2以降でユーザーが独自音源をアップロード可能に

---

## 4. フロントエンドアーキテクチャ

### 4.1 ディレクトリ構成

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                # ランディングページ
│   ├── dashboard/              # ダッシュボード
│   │   └── page.tsx
│   ├── editor/                 # メインエディタ
│   │   └── [projectId]/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── api/                    # API Routes（必要に応じて）
│
├── components/                 # Reactコンポーネント
│   ├── ui/                     # shadcn/ui コンポーネント
│   │   ├── button.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   ├── editor/                 # エディタ専用コンポーネント
│   │   ├── PianoRoll.tsx      ★ 最重要
│   │   ├── Timeline.tsx
│   │   ├── TrackList.tsx
│   │   ├── Toolbar.tsx
│   │   ├── WaveformDisplay.tsx
│   │   └── TransportControls.tsx
│   ├── dashboard/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectList.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── SignupForm.tsx
│
├── lib/                        # ライブラリ・ユーティリティ
│   ├── supabase/
│   │   ├── client.ts           # Supabaseクライアント
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── storage.ts
│   ├── audio/                  # 音声処理エンジン ★ 最重要
│   │   ├── AudioEngine.ts      # メインエンジン
│   │   ├── SoundManager.ts     # 音源管理
│   │   ├── Sampler.ts          # サンプラー
│   │   ├── Synthesizer.ts      # シンセサイザー
│   │   └── effects/
│   │       ├── Reverb.ts
│   │       ├── Delay.ts
│   │       └── Compressor.ts
│   ├── editor/
│   │   ├── PianoRollEngine.ts  # ピアノロール描画エンジン
│   │   ├── TimelineEngine.ts
│   │   └── NoteEditor.ts
│   ├── utils/
│   │   ├── midi.ts             # MIDI関連ユーティリティ
│   │   ├── music.ts            # 音楽理論ユーティリティ
│   │   └── time.ts             # 時間変換ユーティリティ
│   └── hooks/                  # カスタムフック
│       ├── useAudio.ts
│       ├── useProject.ts
│       ├── usePianoRoll.ts
│       └── useAutoSave.ts
│
├── types/                      # TypeScript型定義
│   ├── project.ts
│   ├── track.ts
│   ├── note.ts
│   └── audio.ts
│
└── styles/
    └── globals.css
```

### 4.2 状態管理

**選択肢:**

#### オプション1: Zustand（推奨）
```typescript
// lib/store/editorStore.ts
import { create } from 'zustand';

interface EditorState {
  // Project
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;

  // Tracks
  tracks: Track[];
  addTrack: (track: Track) => void;
  removeTrack: (id: string) => void;

  // Playback
  isPlaying: boolean;
  currentTime: number;
  tempo: number;

  // UI
  zoom: number;
  selectedNotes: string[];
}

export const useEditorStore = create<EditorState>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  // ...
}));
```

**理由:**
- 軽量（~1KB）
- シンプルなAPI
- React Contextより高速
- TypeScript完全対応

#### オプション2: Jotai
- より細かい粒度の状態管理
- パフォーマンス重視の場合

**決定: Zustand採用**

---

## 5. 音声処理アーキテクチャ（最重要）

### 5.1 AudioEngine設計

```typescript
// lib/audio/AudioEngine.ts
import * as Tone from 'tone';

export class AudioEngine {
  private transport: Tone.Transport;
  private samplers: Map<string, Tone.Sampler>;
  private synthesizers: Map<string, Tone.PolySynth>;
  private masterGain: Tone.Gain;

  constructor() {
    this.transport = Tone.Transport;
    this.samplers = new Map();
    this.synthesizers = new Map();
    this.masterGain = new Tone.Gain(0.8).toDestination();
  }

  // 初期化
  async init() {
    await Tone.start();
    console.log('Audio Engine initialized');
  }

  // 音源をロード
  async loadInstrument(name: string, type: 'sample' | 'synth') {
    if (type === 'sample') {
      const sampler = await this.createSampler(name);
      this.samplers.set(name, sampler);
    } else {
      const synth = this.createSynthesizer(name);
      this.synthesizers.set(name, synth);
    }
  }

  // サンプラー作成
  private async createSampler(instrumentName: string): Promise<Tone.Sampler> {
    const urls = await this.fetchSampleUrls(instrumentName);
    return new Tone.Sampler({
      urls: urls,
      baseUrl: `${SUPABASE_STORAGE_URL}/sound-library/${instrumentName}/`,
      onload: () => {
        console.log(`${instrumentName} loaded`);
      }
    }).connect(this.masterGain);
  }

  // シンセサイザー作成
  private createSynthesizer(type: string): Tone.PolySynth {
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: type as any }
    }).connect(this.masterGain);
  }

  // ノートを再生
  playNote(instrument: string, note: string, duration: number, velocity: number) {
    const sampler = this.samplers.get(instrument);
    if (sampler) {
      sampler.triggerAttackRelease(note, duration, undefined, velocity / 127);
    }
  }

  // トラックをスケジュール
  scheduleTrack(track: Track, notes: Note[]) {
    const part = new Tone.Part((time, note) => {
      this.playNote(
        track.instrument,
        this.midiToNoteName(note.pitch),
        note.duration,
        note.velocity
      );
    }, notes.map(n => [n.start_time, n]));

    part.start(0);
    return part;
  }

  // 再生制御
  play() {
    this.transport.start();
  }

  pause() {
    this.transport.pause();
  }

  stop() {
    this.transport.stop();
  }

  // テンポ設定
  setTempo(bpm: number) {
    this.transport.bpm.value = bpm;
  }

  // 現在時間を取得
  getCurrentTime(): number {
    return this.transport.seconds;
  }

  // MIDI番号を音名に変換
  private midiToNoteName(midi: number): string {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = notes[midi % 12];
    return `${note}${octave}`;
  }

  // Supabase Storageから音源URLを取得
  private async fetchSampleUrls(instrument: string): Promise<{ [key: string]: string }> {
    // Supabase Storage APIを使用
    const { data, error } = await supabase.storage
      .from('sound-library')
      .list(`${instrument}/`);

    if (error) throw error;

    const urls: { [key: string]: string } = {};
    data.forEach(file => {
      const noteName = file.name.replace('.mp3', '');
      urls[noteName] = file.name;
    });

    return urls;
  }
}

// シングルトンインスタンス
export const audioEngine = new AudioEngine();
```

### 5.2 波形表示の実装

```typescript
// components/editor/WaveformDisplay.tsx
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

export function WaveformDisplay({ track }: { track: Track }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // WaveSurferを初期化
    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4F46E5',
      progressColor: '#818CF8',
      height: 80,
      barWidth: 2,
      responsive: true,
    });

    // リアルタイム波形を生成
    generateWaveform(track);

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [track]);

  return <div ref={containerRef} className="w-full" />;
}
```

---

## 6. ピアノロールエディタ設計（最重要）

### 6.1 要件

- **5分間の楽曲対応**: 300秒 = 約1200小節（4/4拍子、BPM120の場合）
- **リアルタイム編集**: 60FPS描画
- **大量のノート**: 10,000ノート以上を扱える
- **ズーム・スクロール**: 滑らかな操作感
- **マルチトラック表示**: 8トラック同時表示

### 6.2 実装方針

**Canvas API使用（高パフォーマンス）**

```typescript
// lib/editor/PianoRollEngine.ts
export class PianoRollEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private notes: Note[] = [];
  private zoom: number = 1.0;
  private scrollX: number = 0;
  private scrollY: number = 0;

  // グリッド設定
  private pixelsPerBeat: number = 40;
  private keyHeight: number = 12;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
  }

  // 描画メインループ
  render() {
    this.clear();
    this.drawGrid();
    this.drawPianoKeys();
    this.drawNotes();
    this.drawPlayhead();
  }

  // グリッド描画
  private drawGrid() {
    const { width, height } = this.canvas;
    this.ctx.strokeStyle = '#374151';
    this.ctx.lineWidth = 0.5;

    // 垂直線（拍）
    for (let beat = 0; beat < 1200; beat++) {
      const x = beat * this.pixelsPerBeat * this.zoom - this.scrollX;
      if (x < 0 || x > width) continue;

      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    // 水平線（音階）
    for (let key = 0; key < 88; key++) {
      const y = key * this.keyHeight - this.scrollY;
      if (y < 0 || y > height) continue;

      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }

  // ノート描画
  private drawNotes() {
    this.notes.forEach(note => {
      const x = this.timeToX(note.start_time);
      const y = this.pitchToY(note.pitch);
      const width = this.durationToWidth(note.duration);
      const height = this.keyHeight - 2;

      // ノートの矩形を描画
      this.ctx.fillStyle = this.getNoteColor(note);
      this.ctx.fillRect(x, y, width, height);

      // ベロシティを透明度で表現
      this.ctx.globalAlpha = note.velocity / 127;
      this.ctx.fillStyle = '#60A5FA';
      this.ctx.fillRect(x, y, width, height);
      this.ctx.globalAlpha = 1.0;
    });
  }

  // 時間→X座標変換
  private timeToX(time: number): number {
    const beats = time * (this.tempo / 60);
    return beats * this.pixelsPerBeat * this.zoom - this.scrollX;
  }

  // 音程→Y座標変換
  private pitchToY(pitch: number): number {
    return (88 - pitch) * this.keyHeight - this.scrollY;
  }

  // クリック位置からノート情報を計算
  positionToNote(x: number, y: number): { pitch: number; time: number } {
    const time = ((x + this.scrollX) / this.zoom) / this.pixelsPerBeat * (60 / this.tempo);
    const pitch = 88 - Math.floor((y + this.scrollY) / this.keyHeight);
    return { pitch, time };
  }
}
```

### 6.3 パフォーマンス最適化

1. **Virtual Scrolling**: 表示範囲外のノートは描画しない
2. **RequestAnimationFrame**: 60FPS維持
3. **Worker Thread**: 大量ノートの計算をバックグラウンドで
4. **Memoization**: React.memoで不要な再レンダリング防止

---

## 7. 自動保存システム

```typescript
// lib/hooks/useAutoSave.ts
export function useAutoSave(projectId: string, interval: number = 30000) {
  const editorState = useEditorStore();

  useEffect(() => {
    const timer = setInterval(async () => {
      // 変更があれば保存
      if (editorState.isDirty) {
        await saveProject(projectId, editorState);
        console.log('Auto-saved');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [projectId, editorState]);
}
```

---

## 8. パフォーマンス目標

| 指標 | 目標値 |
|------|--------|
| 初回ロード | < 3秒 |
| プロジェクトオープン | < 2秒 |
| ノート配置レスポンス | < 50ms |
| 再生開始 | < 100ms |
| 描画フレームレート | 60 FPS |
| 5分楽曲の再生 | 安定動作 |
| 10,000ノートの編集 | スムーズ |

---

## 9. スケーラビリティ

### 現在（MVP）
- 同時ユーザー: 100人
- プロジェクト総数: 10,000件
- 音源データ: 100GB

### 将来（v2以降）
- 同時ユーザー: 10,000人
- プロジェクト総数: 1,000,000件
- 音源データ: 1TB+
- Supabase Enterpriseプランへ移行検討

---

## 10. セキュリティ

### Row Level Security（RLS）

```sql
-- プロジェクトは自分のものだけ読み書き可能
CREATE POLICY "Users can CRUD their own projects"
ON projects
FOR ALL
USING (auth.uid() = user_id);

-- 公開プロジェクトは誰でも読める
CREATE POLICY "Public projects are readable by everyone"
ON projects
FOR SELECT
USING (is_public = true);
```

---

## 11. 次のステップ

明日実施するタスク：
1. Supabase Proプラン契約
2. データベーススキーマの作成
3. Storageバケットの作成
4. Vercel連携
5. 環境変数設定
6. 機能詳細設計（UI設計）

---

**このアーキテクチャで、素晴らしいDTMアプリケーションを構築します！**

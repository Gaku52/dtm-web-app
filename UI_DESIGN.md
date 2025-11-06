# 詳細UI設計書（実装レベル）

**作成日**: 2025-11-06
**バージョン**: 1.0.0

> 実際のDAWソフト（Ableton Live、FL Studio、Logic Pro）レベルの詳細な操作系を定義します。

---

## 目次

1. [全体レイアウト（ピクセル単位）](#1-全体レイアウトピクセル単位)
2. [ヘッダーバー](#2-ヘッダーバー)
3. [メインツールバー](#3-メインツールバー)
4. [左サイドバー（トラックリスト）](#4-左サイドバートラックリスト)
5. [ピアノロールエディタ](#5-ピアノロールエディタ)
6. [右サイドバー（インスペクター）](#6-右サイドバーインスペクター)
7. [下部パネル（ミキサー・波形）](#7-下部パネルミキサー波形)
8. [コンテキストメニュー](#8-コンテキストメニュー)
9. [モーダルダイアログ](#9-モーダルダイアログ)
10. [キーボードピアノ](#10-キーボードピアノ)
11. [全UIコンポーネント一覧](#11-全uiコンポーネント一覧)

---

## 1. 全体レイアウト（ピクセル単位）

### デスクトップ（1920x1080 基準）

```
┌─────────────────────────────────────────────────────────────────┐
│ Header Bar (64px)                                               │ 64px
│ [Logo] [Project Name] [Save] [Export] [Share] [User]           │
├──────────┬──────────────────────────────────────────┬───────────┤
│ Main Toolbar (56px)                                 │           │ 56px
│ [Tools] [Grid] [Snap] [▶] [■] [●] [120 BPM] [Loop] │           │
├──────────┴──────────────────────────────────────────┴───────────┤
│          │                                          │           │
│  Track   │      Piano Roll Canvas                   │Inspector  │
│  List    │      (Main Editor)                       │  Panel    │
│  (240px) │                                          │  (280px)  │
│          │                                          │           │
│  [Piano] │                                          │ [Note]    │
│  [Guitar]│      [Notes & Grid]                     │ [Props]   │
│  [Drums] │                                          │           │
│  [+]     │                                          │ [Track]   │
│          │                                          │ [Props]   │
│          │                                          │           │
│          │                                          │           │ 720px
├──────────┴──────────────────────────────────────────┴───────────┤
│ Bottom Panel (240px) - Tabbed                                   │
│ [Mixer] [Waveform] [Timeline] [Automation]                      │ 240px
│ ▂▃▅▇█▇▅▃▂ ▂▃▅▇█▇▅▃▂ ▂▃▅▇█▇▅▃▂                                 │
└─────────────────────────────────────────────────────────────────┘
   240px          1400px                                280px
```

**サイズ定義:**
```typescript
const LAYOUT = {
  header: { height: 64 },
  toolbar: { height: 56 },
  trackList: { width: 240 },
  inspector: { width: 280 },
  bottomPanel: { height: 240 },
  pianoKeys: { width: 60 }, // ピアノロール内の鍵盤表示
}
```

---

## 2. ヘッダーバー

### 2.1 レイアウト

```
┌──────────────────────────────────────────────────────────┐
│ [🎵 Logo]  My Song - Edited  💾 Saved 2m ago             │
│                                                          │
│           [↩ Undo] [↪ Redo]    [💾 Save] [📤 Export]    │
│                                                   [@User]│
└──────────────────────────────────────────────────────────┘
```

### 2.2 コンポーネント詳細

#### 左側
```typescript
// Logo + Project Name
<div className="flex items-center gap-4">
  <Logo size={32} />
  <div>
    <h1 className="text-lg font-semibold">My Song</h1>
    <p className="text-xs text-gray-400">
      {isDirty ? '• Edited' : '💾 Saved 2m ago'}
    </p>
  </div>
</div>
```

#### 中央
```typescript
// History Controls
<div className="flex items-center gap-2">
  <Button
    variant="ghost"
    size="sm"
    disabled={!canUndo}
    onClick={undo}
  >
    <UndoIcon /> Undo
  </Button>
  <Button
    variant="ghost"
    size="sm"
    disabled={!canRedo}
    onClick={redo}
  >
    <RedoIcon /> Redo
  </Button>
</div>
```

#### 右側
```typescript
// Actions + User
<div className="flex items-center gap-3">
  <Button onClick={save} variant="primary">
    <SaveIcon /> Save
  </Button>
  <Button onClick={exportProject}>
    <ExportIcon /> Export
  </Button>
  <Button onClick={shareProject} variant="outline">
    <ShareIcon /> Share
  </Button>
  <UserMenu />
</div>
```

---

## 3. メインツールバー

### 3.1 完全なレイアウト

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Section 1: Tools] [Section 2: Grid] [Section 3: Playback] [Section 4: Settings] │
│                                                                        │
│ [✏️ Pen] [↖️ Select] [✂️ Cut] [🧹 Erase] │ [Grid: 1/16▼] [⊞ Snap] [♪3] │
│                                          │                            │
│ [◀◀] [▶/❚❚] [■] [●Rec]  │  [120] BPM [4/4▼]  │  [🔁 Loop] [🎵 Metro] │  [⚙️] │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 各セクション詳細

#### Section 1: 編集ツール
```typescript
const TOOLS = [
  { id: 'pen', icon: PenIcon, label: 'Pen Tool', shortcut: 'P' },
  { id: 'select', icon: SelectIcon, label: 'Select', shortcut: 'V' },
  { id: 'cut', icon: ScissorsIcon, label: 'Cut', shortcut: 'C' },
  { id: 'erase', icon: EraserIcon, label: 'Erase', shortcut: 'E' },
  { id: 'mute', icon: MuteIcon, label: 'Mute', shortcut: 'M' },
  { id: 'hand', icon: HandIcon, label: 'Hand (Pan)', shortcut: 'H' },
] as const;

// UI
<ToggleGroup type="single" value={currentTool}>
  {TOOLS.map(tool => (
    <ToggleGroupItem key={tool.id} value={tool.id}>
      <tool.icon className="w-4 h-4" />
      <span className="ml-1">{tool.label}</span>
      <kbd className="ml-2 text-xs">{tool.shortcut}</kbd>
    </ToggleGroupItem>
  ))}
</ToggleGroup>
```

#### Section 2: グリッド設定
```typescript
// Grid Resolution Selector
<Select value={gridResolution} onValueChange={setGridResolution}>
  <SelectTrigger className="w-32">
    <SelectValue placeholder="Grid" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1/1">1/1 (Whole)</SelectItem>
    <SelectItem value="1/2">1/2 (Half)</SelectItem>
    <SelectItem value="1/4">1/4 (Quarter)</SelectItem>
    <SelectItem value="1/8">1/8 (8th)</SelectItem>
    <SelectItem value="1/16">1/16 (16th)</SelectItem>
    <SelectItem value="1/32">1/32 (32nd)</SelectItem>
    <SelectItem value="1/64">1/64 (64th)</SelectItem>
  </SelectContent>
</Select>

// Snap Toggle
<Toggle pressed={snapEnabled} onPressedChange={setSnapEnabled}>
  <GridIcon />
  <span className="ml-1">Snap</span>
</Toggle>

// Triplet Toggle
<Toggle pressed={tripletMode} onPressedChange={setTripletMode}>
  <MusicIcon />
  <span className="ml-1">Triplet</span>
</Toggle>

// Quantize Button
<Button onClick={quantizeSelected} variant="outline" size="sm">
  <AlignIcon /> Quantize
</Button>
```

#### Section 3: 再生コントロール
```typescript
// Transport Controls
<div className="flex items-center gap-2">
  {/* Skip to Start */}
  <Button
    onClick={skipToStart}
    variant="ghost"
    size="icon"
    title="Skip to Start (Home)"
  >
    <SkipBackIcon />
  </Button>

  {/* Play/Pause */}
  <Button
    onClick={togglePlayPause}
    variant="primary"
    size="icon"
    className="w-12 h-12"
    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
  >
    {isPlaying ? <PauseIcon /> : <PlayIcon />}
  </Button>

  {/* Stop */}
  <Button
    onClick={stop}
    variant="ghost"
    size="icon"
    title="Stop (Esc)"
  >
    <StopIcon />
  </Button>

  {/* Record */}
  <Button
    onClick={toggleRecord}
    variant={isRecording ? 'destructive' : 'ghost'}
    size="icon"
    title="Record (R)"
  >
    <RecordIcon className={isRecording ? 'animate-pulse' : ''} />
  </Button>

  <Separator orientation="vertical" className="h-8" />

  {/* BPM Control */}
  <div className="flex items-center gap-2">
    <Button
      onClick={() => adjustTempo(-1)}
      variant="ghost"
      size="icon"
    >
      <MinusIcon />
    </Button>
    <Input
      type="number"
      value={tempo}
      onChange={(e) => setTempo(Number(e.target.value))}
      className="w-16 text-center"
      min={40}
      max={300}
    />
    <span className="text-sm text-gray-400">BPM</span>
    <Button
      onClick={() => adjustTempo(1)}
      variant="ghost"
      size="icon"
    >
      <PlusIcon />
    </Button>
  </div>

  {/* Time Signature */}
  <Select value={timeSignature} onValueChange={setTimeSignature}>
    <SelectTrigger className="w-20">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="4/4">4/4</SelectItem>
      <SelectItem value="3/4">3/4</SelectItem>
      <SelectItem value="6/8">6/8</SelectItem>
      <SelectItem value="5/4">5/4</SelectItem>
      <SelectItem value="7/8">7/8</SelectItem>
    </SelectContent>
  </Select>

  <Separator orientation="vertical" className="h-8" />

  {/* Loop Toggle */}
  <Toggle pressed={loopEnabled} onPressedChange={setLoopEnabled}>
    <RepeatIcon />
    <span className="ml-1">Loop</span>
  </Toggle>

  {/* Metronome */}
  <Toggle pressed={metronomeEnabled} onPressedChange={setMetronomeEnabled}>
    <MetronomeIcon />
    <span className="ml-1">Metro</span>
  </Toggle>
</div>
```

#### Section 4: 表示・設定
```typescript
// View Controls
<div className="flex items-center gap-2">
  {/* Zoom Controls */}
  <div className="flex items-center gap-1">
    <Button onClick={zoomOut} variant="ghost" size="icon">
      <ZoomOutIcon />
    </Button>
    <span className="text-sm">{Math.round(zoom * 100)}%</span>
    <Button onClick={zoomIn} variant="ghost" size="icon">
      <ZoomInIcon />
    </Button>
  </div>

  <Separator orientation="vertical" className="h-8" />

  {/* Settings */}
  <Button onClick={openSettings} variant="ghost" size="icon">
    <SettingsIcon />
  </Button>
</div>
```

---

## 4. 左サイドバー（トラックリスト）

### 4.1 トラックアイテム（詳細）

```
┌─────────────────────────────────────┐
│ Track 1                      [☰]    │ ← ドラッグハンドル
├─────────────────────────────────────┤
│ 🎹 Piano Lead                       │
│                                     │
│ ●●●●●●●━━━━━━━━━━━━ 75%           │ ← Volume
│ ━━━━●━━━━━ C                       │ ← Pan
│                                     │
│ [M] [S] [R] [🔇] [🎚️]              │ ← Controls
│                                     │
│ Input: MIDI In 1                    │
│ Output: Master                      │
└─────────────────────────────────────┘
```

### 4.2 完全な実装

```typescript
interface TrackControlsProps {
  track: Track;
  onUpdate: (track: Track) => void;
  onDelete: () => void;
}

function TrackControls({ track, onUpdate, onDelete }: TrackControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-700 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <DragHandle />
          <InstrumentIcon instrument={track.instrument} />
          <span className="font-medium">{track.name}</span>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="icon"
        >
          <ChevronDownIcon className={isExpanded ? 'rotate-180' : ''} />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span>Volume</span>
          <span>{track.volume}%</span>
        </div>
        <Slider
          value={[track.volume]}
          onValueChange={([v]) => onUpdate({ ...track, volume: v })}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Pan Control */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span>Pan</span>
          <span>{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</span>
        </div>
        <Slider
          value={[track.pan]}
          onValueChange={([p]) => onUpdate({ ...track, pan: p })}
          min={-100}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 mb-2">
        <Toggle
          pressed={track.muted}
          onPressedChange={(m) => onUpdate({ ...track, muted: m })}
          size="sm"
          title="Mute (M)"
        >
          M
        </Toggle>
        <Toggle
          pressed={track.solo}
          onPressedChange={(s) => onUpdate({ ...track, solo: s })}
          size="sm"
          title="Solo (S)"
        >
          S
        </Toggle>
        <Toggle
          pressed={track.armed}
          onPressedChange={(a) => onUpdate({ ...track, armed: a })}
          size="sm"
          variant="destructive"
          title="Arm Recording (R)"
        >
          R
        </Toggle>
        <Button
          onClick={() => setTrackMonitor(!track.monitor)}
          variant="ghost"
          size="sm"
          title="Monitor"
        >
          <HeadphonesIcon />
        </Button>
        <Button
          onClick={openMixer}
          variant="ghost"
          size="sm"
          title="Open Mixer"
        >
          <SlidersIcon />
        </Button>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
          {/* Instrument Selector */}
          <div>
            <label className="text-xs text-gray-400">Instrument</label>
            <Select
              value={track.instrument}
              onValueChange={(i) => onUpdate({ ...track, instrument: i })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSTRUMENTS.map(inst => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.icon} {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs text-gray-400">Color</label>
            <div className="flex gap-2 mt-1">
              {TRACK_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => onUpdate({ ...track, color })}
                  className={cn(
                    'w-6 h-6 rounded',
                    track.color === color && 'ring-2 ring-white'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Input/Output */}
          <div>
            <label className="text-xs text-gray-400">Input</label>
            <Select value={track.input}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midi-1">MIDI In 1</SelectItem>
                <SelectItem value="midi-2">MIDI In 2</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-gray-400">Output</label>
            <Select value={track.output}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="send-1">Send 1</SelectItem>
                <SelectItem value="send-2">Send 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => duplicateTrack(track)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Duplicate
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4.3 トラック追加ボタン

```typescript
function AddTrackButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="ghost"
        className="w-full"
      >
        <PlusIcon /> Add Track
      </Button>

      {/* Instrument Selection Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Track</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3">
            {INSTRUMENTS.map(instrument => (
              <button
                key={instrument.id}
                onClick={() => addTrack(instrument)}
                className="p-4 border rounded hover:bg-gray-50"
              >
                <div className="text-3xl mb-2">{instrument.icon}</div>
                <div className="text-sm font-medium">{instrument.name}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## 5. ピアノロールエディタ

### 5.1 完全なレイアウト

```
┌───┬──────────────────────────────────────────────────┐
│ C8│                                                  │
│ B7│                                                  │
│ A7│     [Note]  [Note]                              │ ← Grid + Notes
│ G7│                                                  │
│ F7│                    [Note]                       │
│...│                                                  │
│ C4│  [Note]     [Note]         [Note]               │
│ B3│                                                  │
│ A3│        [Note]                                   │
│...│                                                  │
│ C0│                                                  │
├───┴──────────────────────────────────────────────────┤
│ Velocity Editor (80px)                              │
│ ▂█▅▃ ▇▅▂ ▃▅▇█                                       │
└─────────────────────────────────────────────────────┘
   60px (Piano Keys)      Canvas Area
```

### 5.2 ピアノキー（左側）

```typescript
function PianoKeys({ height, keyHeight }: PianoKeysProps) {
  const keys = generateKeys(); // C0-C8

  return (
    <div className="w-[60px] bg-gray-900">
      {keys.map((key, index) => (
        <div
          key={key.note}
          className={cn(
            'border-b border-gray-700 flex items-center justify-end pr-2',
            key.isBlack ? 'bg-gray-800 text-gray-400' : 'bg-gray-900',
            'hover:bg-blue-900 cursor-pointer'
          )}
          style={{ height: keyHeight }}
          onClick={() => playNote(key.midi)}
          onMouseEnter={() => previewNote(key.midi)}
        >
          <span className="text-xs font-mono">{key.note}</span>
        </div>
      ))}
    </div>
  );
}
```

### 5.3 グリッド描画（Canvas）

```typescript
function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoom: number,
  scrollX: number,
  scrollY: number
) {
  const pixelsPerBeat = 40 * zoom;
  const keyHeight = 12;

  // 垂直線（拍）
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;

  for (let beat = 0; beat < 10000; beat++) {
    const x = beat * pixelsPerBeat - scrollX;
    if (x < -pixelsPerBeat || x > width) continue;

    // 小節線は太く
    if (beat % 4 === 0) {
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
    }

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 水平線（音階）
  for (let key = 0; key < 88; key++) {
    const y = key * keyHeight - scrollY;
    if (y < 0 || y > height) continue;

    // C音は強調
    const note = key % 12;
    ctx.strokeStyle = note === 0 ? '#4B5563' : '#374151';
    ctx.lineWidth = note === 0 ? 1.5 : 0.5;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}
```

### 5.4 ノート描画

```typescript
function drawNote(
  ctx: CanvasRenderingContext2D,
  note: Note,
  isSelected: boolean,
  isHovered: boolean
) {
  const x = timeToX(note.start_time);
  const y = pitchToY(note.pitch);
  const width = durationToWidth(note.duration);
  const height = KEY_HEIGHT - 2;

  // ノートの背景
  const alpha = note.velocity / 127;
  ctx.fillStyle = isSelected
    ? `rgba(139, 92, 246, ${alpha})` // 紫（選択時）
    : `rgba(96, 165, 250, ${alpha})`; // 青（通常）

  ctx.fillRect(x, y, width, height);

  // ボーダー
  if (isHovered || isSelected) {
    ctx.strokeStyle = isSelected ? '#8B5CF6' : '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }

  // ベロシティインジケーター（上部の細いバー）
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.fillRect(x, y, width, 2);
}
```

### 5.5 ベロシティエディタ（下部）

```typescript
function VelocityEditor({ notes, selectedNotes }: VelocityEditorProps) {
  return (
    <div className="h-20 bg-gray-900 border-t border-gray-700">
      <div className="flex items-end h-full px-2">
        {notes.map(note => {
          const x = timeToX(note.start_time);
          const height = (note.velocity / 127) * 60;

          return (
            <div
              key={note.id}
              style={{
                position: 'absolute',
                left: x,
                height: height,
                width: 6,
                bottom: 0,
              }}
              className={cn(
                'bg-blue-500 cursor-ns-resize',
                selectedNotes.includes(note.id) && 'bg-purple-500'
              )}
              onMouseDown={(e) => startVelocityDrag(e, note)}
            />
          );
        })}
      </div>

      {/* Velocity Value Display */}
      {selectedNotes.length > 0 && (
        <div className="absolute top-2 right-2 text-xs text-gray-400">
          Velocity: {getAverageVelocity(selectedNotes)}
        </div>
      )}
    </div>
  );
}
```

---

## 6. 右サイドバー（インスペクター）

### 6.1 ノートプロパティ

```typescript
function NoteInspector({ selectedNotes }: NoteInspectorProps) {
  if (selectedNotes.length === 0) {
    return <EmptyState message="Select notes to edit properties" />;
  }

  const note = selectedNotes[0]; // 複数選択時は最初のノート

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">Note Properties</h3>

      {/* Pitch */}
      <div>
        <label className="text-sm text-gray-400">Pitch</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={note.pitch}
            onChange={(e) => updateNotePitch(note.id, Number(e.target.value))}
            min={0}
            max={127}
            className="flex-1"
          />
          <span className="text-sm">{midiToNoteName(note.pitch)}</span>
        </div>
      </div>

      {/* Start Time */}
      <div>
        <label className="text-sm text-gray-400">Start Time</label>
        <Input
          type="number"
          value={note.start_time}
          onChange={(e) => updateNoteStartTime(note.id, Number(e.target.value))}
          step={0.125}
          min={0}
        />
      </div>

      {/* Duration */}
      <div>
        <label className="text-sm text-gray-400">Duration</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={note.duration}
            onChange={(e) => updateNoteDuration(note.id, Number(e.target.value))}
            step={0.125}
            min={0.125}
            className="flex-1"
          />
          <Select
            value={durationToNotation(note.duration)}
            onValueChange={(v) => updateNoteDuration(note.id, notationToDuration(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1/1">Whole</SelectItem>
              <SelectItem value="1/2">Half</SelectItem>
              <SelectItem value="1/4">Quarter</SelectItem>
              <SelectItem value="1/8">8th</SelectItem>
              <SelectItem value="1/16">16th</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Velocity */}
      <div>
        <label className="text-sm text-gray-400">Velocity</label>
        <div className="space-y-2">
          <Slider
            value={[note.velocity]}
            onValueChange={([v]) => updateNoteVelocity(note.id, v)}
            min={0}
            max={127}
            step={1}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 (pp)</span>
            <span>{note.velocity}</span>
            <span>127 (ff)</span>
          </div>
        </div>
      </div>

      {/* Multiple Selection Info */}
      {selectedNotes.length > 1 && (
        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            {selectedNotes.length} notes selected
          </p>
          <div className="mt-2 space-y-2">
            <Button onClick={() => quantizeNotes(selectedNotes)} className="w-full">
              Quantize All
            </Button>
            <Button onClick={() => deleteNotes(selectedNotes)} variant="destructive" className="w-full">
              Delete All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 6.2 トラックプロパティ

```typescript
function TrackInspector({ track }: TrackInspectorProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">Track Properties</h3>

      {/* Basic Info */}
      <div>
        <label className="text-sm text-gray-400">Name</label>
        <Input
          value={track.name}
          onChange={(e) => updateTrackName(track.id, e.target.value)}
        />
      </div>

      {/* Instrument */}
      <div>
        <label className="text-sm text-gray-400">Instrument</label>
        <Select value={track.instrument}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INSTRUMENTS.map(inst => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.icon} {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Effects Chain */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Effects</label>
        <div className="space-y-2">
          {track.effects.map((effect, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
              <span className="flex-1">{effect.name}</span>
              <Button
                onClick={() => removeEffect(track.id, index)}
                variant="ghost"
                size="icon"
              >
                <XIcon />
              </Button>
            </div>
          ))}
          <Button onClick={() => addEffect(track.id)} variant="outline" className="w-full">
            <PlusIcon /> Add Effect
          </Button>
        </div>
      </div>

      {/* MIDI Settings */}
      <div>
        <label className="text-sm text-gray-400">Transpose</label>
        <Input
          type="number"
          value={track.transpose}
          onChange={(e) => updateTrackTranspose(track.id, Number(e.target.value))}
          min={-48}
          max={48}
        />
      </div>
    </div>
  );
}
```

---

## 7. 下部パネル（ミキサー・波形）

### 7.1 タブ構成

```typescript
<Tabs defaultValue="mixer">
  <TabsList className="w-full">
    <TabsTrigger value="mixer">Mixer</TabsTrigger>
    <TabsTrigger value="waveform">Waveform</TabsTrigger>
    <TabsTrigger value="timeline">Timeline</TabsTrigger>
    <TabsTrigger value="automation">Automation</TabsTrigger>
  </TabsList>

  <TabsContent value="mixer">
    <MixerView />
  </TabsContent>

  <TabsContent value="waveform">
    <WaveformView />
  </TabsContent>

  <TabsContent value="timeline">
    <TimelineView />
  </TabsContent>

  <TabsContent value="automation">
    <AutomationView />
  </TabsContent>
</Tabs>
```

### 7.2 ミキサービュー

```typescript
function MixerView({ tracks }: MixerViewProps) {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      {tracks.map(track => (
        <div key={track.id} className="w-20 flex flex-col items-center">
          {/* Fader */}
          <div className="h-40 relative">
            <input
              type="range"
              orient="vertical"
              min={0}
              max={100}
              value={track.volume}
              onChange={(e) => updateTrackVolume(track.id, Number(e.target.value))}
              className="vertical-slider"
            />
          </div>

          {/* Peak Meter */}
          <div className="w-4 h-40 bg-gray-800 rounded relative">
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500"
              style={{ height: `${track.peakLevel}%` }}
            />
          </div>

          {/* Pan Knob */}
          <div className="mt-2">
            <Knob
              value={track.pan}
              onChange={(v) => updateTrackPan(track.id, v)}
              min={-100}
              max={100}
              size={40}
            />
            <span className="text-xs">Pan</span>
          </div>

          {/* Controls */}
          <div className="mt-2 space-y-1">
            <Button
              onClick={() => toggleMute(track.id)}
              variant={track.muted ? 'default' : 'ghost'}
              size="sm"
              className="w-full"
            >
              M
            </Button>
            <Button
              onClick={() => toggleSolo(track.id)}
              variant={track.solo ? 'default' : 'ghost'}
              size="sm"
              className="w-full"
            >
              S
            </Button>
          </div>

          {/* Track Name */}
          <div className="mt-2 text-xs text-center truncate w-full">
            {track.name}
          </div>
        </div>
      ))}

      {/* Master Channel */}
      <div className="w-24 border-l-2 border-gray-700 pl-2">
        <div className="text-center font-semibold mb-2">Master</div>
        {/* Master Fader, Meter, etc. */}
      </div>
    </div>
  );
}
```

---

## 8. コンテキストメニュー

### 8.1 ノート右クリックメニュー

```typescript
function NoteContextMenu({ note, position }: NoteContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => copyNote(note)}>
          <CopyIcon /> Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={() => cutNote(note)}>
          <ScissorsIcon /> Cut
        </ContextMenuItem>
        <ContextMenuItem onClick={() => duplicateNote(note)}>
          <CopyPlusIcon /> Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => quantizeNote(note)}>
          <AlignIcon /> Quantize
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Transpose</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => transposeNote(note, 12)}>
              +1 Octave
            </ContextMenuItem>
            <ContextMenuItem onClick={() => transposeNote(note, 1)}>
              +1 Semitone
            </ContextMenuItem>
            <ContextMenuItem onClick={() => transposeNote(note, -1)}>
              -1 Semitone
            </ContextMenuItem>
            <ContextMenuItem onClick={() => transposeNote(note, -12)}>
              -1 Octave
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => deleteNote(note)} className="text-red-500">
          <TrashIcon /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

---

## 9. モーダルダイアログ

### 9.1 エクスポートダイアログ

```typescript
function ExportDialog({ projectId }: ExportDialogProps) {
  const [format, setFormat] = useState<'midi' | 'wav' | 'mp3'>('midi');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium">Format</label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="midi" id="midi" />
                <label htmlFor="midi">
                  MIDI (.mid) - For use in other DAWs
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wav" id="wav" />
                <label htmlFor="wav">
                  WAV (.wav) - Lossless audio
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp3" id="mp3" />
                <label htmlFor="mp3">
                  MP3 (.mp3) - Compressed audio
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Quality (for audio formats) */}
          {format !== 'midi' && (
            <div>
              <label className="text-sm font-medium">Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (320kbps)</SelectItem>
                  <SelectItem value="medium">Medium (192kbps)</SelectItem>
                  <SelectItem value="low">Low (128kbps)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Options */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Checkbox id="normalize" />
              <span className="text-sm">Normalize audio</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox id="include-fx" />
              <span className="text-sm">Include effects</span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={() => exportProject(format, quality)}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 10. キーボードピアノ（オンスクリーンキーボード）

```typescript
function OnScreenPiano() {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 border rounded-lg p-2">
      <div className="flex">
        {/* White Keys */}
        {PIANO_KEYS.white.map(key => (
          <button
            key={key.midi}
            onMouseDown={() => playNote(key.midi)}
            onMouseUp={() => stopNote(key.midi)}
            className={cn(
              'w-12 h-32 bg-white border border-gray-300 rounded-b',
              activeKeys.has(key.midi) && 'bg-blue-200'
            )}
          >
            <span className="text-xs text-gray-600">{key.label}</span>
          </button>
        ))}

        {/* Black Keys (positioned absolutely) */}
        {PIANO_KEYS.black.map(key => (
          <button
            key={key.midi}
            onMouseDown={() => playNote(key.midi)}
            onMouseUp={() => stopNote(key.midi)}
            className={cn(
              'absolute w-8 h-20 bg-black border border-gray-700 rounded-b',
              activeKeys.has(key.midi) && 'bg-gray-700'
            )}
            style={{ left: key.position }}
          >
            <span className="text-xs text-white">{key.label}</span>
          </button>
        ))}
      </div>

      {/* Octave Controls */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Button onClick={() => shiftOctave(-1)} size="sm">
          ← Octave
        </Button>
        <span className="text-sm">C{currentOctave}</span>
        <Button onClick={() => shiftOctave(1)} size="sm">
          Octave →
        </Button>
      </div>
    </div>
  );
}
```

---

## 11. 全UIコンポーネント一覧

### 必要なコンポーネント（100個以上）

```typescript
// Layout Components
- AppShell
- Header
- Toolbar
- Sidebar
- MainCanvas
- BottomPanel
- ResizablePanel

// Editor Components
- PianoRoll
- PianoKeys
- GridCanvas
- NoteRenderer
- SelectionBox
- VelocityEditor
- PlayheadCursor
- LoopMarkers
- TimeRuler

// Track Components
- TrackList
- TrackItem
- TrackHeader
- TrackControls
- VolumeSlider
- PanKnob
- MuteButton
- SoloButton
- ArmButton
- MonitorButton
- TrackMeter

// Transport Components
- PlayButton
- PauseButton
- StopButton
- RecordButton
- SkipButton
- TempoControl
- TimeSignatureSelector
- LoopToggle
- MetronomeToggle

// Tool Components
- ToolSelector
- PenTool
- SelectTool
- CutTool
- EraseTool
- HandTool
- MuteTool

// Grid Components
- GridResolutionSelector
- SnapToggle
- TripletToggle
- QuantizeButton

// Inspector Components
- NoteInspector
- TrackInspector
- ProjectInspector
- PropertyGrid

// Mixer Components
- MixerView
- ChannelStrip
- Fader
- PeakMeter
- PanControl
- EffectSlot
- SendControl
- MasterChannel

// Waveform Components
- WaveformDisplay
- WaveformRenderer
- AudioAnalyzer

// Timeline Components
- TimelineView
- MarkerTrack
- TempoTrack
- SignatureTrack

// Automation Components
- AutomationLane
- AutomationPoint
- AutomationCurve

// Dialog Components
- ExportDialog
- ImportDialog
- SettingsDialog
- AboutDialog
- ShortcutsDialog
- InstrumentPickerDialog
- ColorPickerDialog
- ConfirmDialog

// Menu Components
- ContextMenu
- DropdownMenu
- MenuBar
- FileMenu
- EditMenu
- ViewMenu
- HelpMenu

// Utility Components
- ZoomControl
- UndoRedoButtons
- SaveIndicator
- LoadingOverlay
- ErrorBoundary
- ToastNotification
- ProgressBar
- Tooltip

// Input Components
- Slider
- Knob
- Toggle
- Button
- IconButton
- Input
- Select
- Checkbox
- Radio
- ColorPicker

// Piano Components
- OnScreenPiano
- WhiteKey
- BlackKey
- OctaveSelector
- SustainPedal

// Total: 100+ components
```

---

## 12. 実装優先順位

### Phase 1: 基本UI（1週間）
```
- AppShell, Header, Toolbar
- TrackList, TrackItem
- PianoRoll (基本グリッド)
- Transport Controls (再生のみ)
```

### Phase 2: エディタ機能（2週間）
```
- ノート配置・編集
- ツール切り替え
- グリッド・スナップ
- 選択・移動・削除
```

### Phase 3: 高度な機能（2週間）
```
- VelocityEditor
- Inspector Panel
- Mixer View
- Waveform Display
```

### Phase 4: 仕上げ（1週間）
```
- コンテキストメニュー
- ダイアログ
- キーボードショートカット
- エクスポート機能
```

---

**この詳細設計に基づいて、プロフェッショナルなDTMアプリのUIを構築します。**

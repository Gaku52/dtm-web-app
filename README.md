# 🎹 DTM Web App

**Web-based professional music composition application**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Pro-green)](https://supabase.com/)

> 「ブラウザだけで、誰でも、今すぐ音楽を作れる」

---

## ✨ Features

- 🎵 **Piano Roll Editor** - Visual note editing with real-time playback
- 🎚️ **Multi-Track Support** - Up to 8 tracks with individual controls
- 🎹 **20+ Instruments** - Professional sound library powered by Supabase Storage
- 📊 **Waveform Display** - Visual feedback of your composition
- 💾 **Auto-Save** - Never lose your work
- 📤 **Audio Export** - Export to WAV/MP3 (completely free, browser-based)
- 🗑️ **Project Management** - Create, delete, and organize projects
- 🌐 **Cross-Platform** - Works on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or higher
- npm 9 or higher
- Supabase account (Pro plan recommended)
- Vercel account (Free plan is sufficient)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gaku52/dtm-web-app.git
   cd dtm-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | Complete setup guide (30 minutes) |
| [SPEC.md](./SPEC.md) | Project specifications and requirements |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture and database design |
| [FEATURES.md](./FEATURES.md) | Detailed feature specifications |
| [UI_DESIGN.md](./UI_DESIGN.md) | UI/UX design guide (100+ components) |
| [SOUND_STRATEGY.md](./SOUND_STRATEGY.md) | Audio implementation strategy |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development workflow and coding standards |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Current project status (living document) |
| [docs/AUTO_LOG_SYSTEM.md](./docs/AUTO_LOG_SYSTEM.md) | Automatic conversation log system |

### 🤖 Automatic Logging System

This project features an **automatic conversation log system** that:
- 📝 Automatically records all development sessions
- 🔄 Maintains context across sessions
- 📊 Tracks decisions and progress
- 🎯 Ensures development continuity

See [docs/AUTO_LOG_SYSTEM.md](./docs/AUTO_LOG_SYSTEM.md) for details.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **State Management**: Zustand

### Audio Engine
- **Core**: Web Audio API
- **Synthesis**: Tone.js
- **MP3 Encoding**: lamejs (browser-based)
- **Waveform**: WaveSurfer.js

### Backend
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (100GB)
- **Auth**: Supabase Authentication

### Deployment
- **Hosting**: Vercel
- **CDN**: Cloudflare (via Supabase)

---

## 📁 Project Structure

```
dtm-web-app/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── editor/         # DTM editor components
│   ├── lib/                # Core libraries
│   │   ├── audio/          # Audio engine
│   │   ├── supabase/       # Database client
│   │   └── hooks/          # Custom React hooks
│   └── types/              # TypeScript types
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── docs/                   # Additional documentation
```

---

## 🎯 Development Roadmap

### Phase 1: MVP (Weeks 1-2) ✅ Planning Complete
- [x] Project setup
- [x] Database schema
- [x] Complete documentation
- [ ] Basic UI implementation
- [ ] Audio engine foundation

### Phase 2: Core Features (Weeks 3-4)
- [ ] Piano roll editor
- [ ] Multi-track support
- [ ] Save/Load projects
- [ ] BPM & time signature

### Phase 3: Advanced Features (Weeks 5-6)
- [ ] Velocity editor
- [ ] Mixer view
- [ ] Waveform display
- [ ] Effects chain

### Phase 4: Polish (Weeks 7-8)
- [ ] Performance optimization
- [ ] MIDI export
- [ ] Mobile responsiveness
- [ ] User testing

---

## 💰 Cost Structure

### Monthly Costs (Recommended)
- **Supabase Pro**: $25/month (~¥3,500)
- **Splice Sounds**: $10/month (~¥1,400)
- **Vercel Free**: $0/month
- **Total**: $35/month (~¥5,000)

### When to Upgrade
- **Vercel Pro ($20/month)**: When you exceed 20,000 users/month or need commercial use

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed coding guidelines.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

### Sound Libraries
- [Philharmonia Orchestra](https://philharmonia.co.uk/) - High-quality orchestral samples (CC BY-SA 3.0)
- [Freesound.org](https://freesound.org/) - Community sound library (various CC licenses)
- [VSCO 2 Community Edition](https://github.com/sgossner/VSCO-2-CE) - Orchestral samples (CC0)

### Technologies
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tone.js](https://tonejs.github.io/)
- [Vercel](https://vercel.com/)

---

## 📞 Contact

- **GitHub**: [@Gaku52](https://github.com/Gaku52)
- **Repository**: [dtm-web-app](https://github.com/Gaku52/dtm-web-app)

---

**Built with passion for music and technology** 🎵✨

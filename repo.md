# Repository Documentation: Quiz Application Frontend

## 📋 Project Overview

**Name:** `frontend`  
**Version:** 0.1.0  
**Type:** Next.js Web Application  
**Purpose:** Full-featured quiz platform frontend with authentication, gamification, economy system, leaderboards, and social features.

This is a modern React-based quiz application that allows users to:
- Authenticate via login/signup
- Take quizzes with multiple question types
- Earn and spend currency (diamonds)
- Manage energy for quiz attempts
- Track performance on leaderboards
- Shop for virtual items
- Browse quiz categories

---

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Framework:** Next.js 16 with TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with PostCSS
- **State Management:** Zustand (for global state)
- **Data Fetching:** Axios + TanStack React Query
- **Real-time Communication:** Socket.IO Client
- **3D Graphics:** Three.js with React Three Fiber & Drei
- **Animations:** Framer Motion + GSAP
- **Scrolling:** Lenis (smooth scrolling)
- **UI Components:** Lucide React (icons)
- **Validation:** Zod
- **Utilities:** Clsx, Tailwind Merge

### Development Tools
- ESLint 9 (code quality)
- TypeScript 5
- Tailwind CSS 4

---

## 📁 Directory Structure

```
sh-out/
├── app/                           # Next.js App Router pages
│   ├── page.tsx                   # Root page
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles
│   ├── providers.tsx              # React context providers
│   ├── favicon.ico
│   ├── auth/
│   │   ├── page.tsx               # Auth page (login/signup)
│   │   └── callback/page.tsx      # OAuth callback
│   ├── home/page.tsx              # Home/dashboard
│   ├── quizzes/
│   │   ├── page.tsx               # Quiz listing
│   │   └── [id]/page.tsx          # Quiz player
│   ├── attempts/[id]/
│   │   └── result/page.tsx        # Quiz results
│   ├── account/page.tsx           # User account page
│   ├── categories/page.tsx        # Quiz categories
│   ├── leaderboard/page.tsx       # Leaderboard view
│   └── shop/page.tsx              # Shop/store
│
├── components/                    # Reusable React components
│   ├── Auth/                      # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── Home/                      # Home page components
│   ├── Journey/                   # Learning journey components
│   ├── LandingPage/               # Landing page components
│   ├── LeaderBoard/               # Leaderboard components
│   ├── QuizPlayer/                # Quiz playing interface
│   │   ├── QuizList.tsx
│   │   ├── QuizPlayer.tsx
│   │   └── QuizResult.tsx
│   ├── Shop/                      # Shop/store components
│   ├── Sidebar/                   # Sidebar navigation
│   ├── ui/                        # Reusable UI primitives
│   ├── AppLayout.tsx              # Main app layout wrapper
│   └── BottomNav.tsx              # Mobile bottom navigation
│
├── hooks/                         # Custom React hooks
│   ├── useEconomy.ts              # Economy system hook (currency/diamonds)
│   ├── useGamemode.ts             # Game mode state management
│   ├── useLeaderboard.ts          # Leaderboard data fetching
│   ├── useSTT.ts                  # Speech-to-Text functionality
│   ├── useTTS.ts                  # Text-to-Speech functionality
│   └── useUser.ts                 # User data hook
│
├── lib/                           # Utility functions & services
│   ├── auth.ts                    # Authentication logic & API calls
│   ├── economy.ts                 # Economy system utilities
│   ├── leaderboard.ts             # Leaderboard utilities
│   ├── quiz.ts                    # Quiz-related utilities
│   ├── stats.ts                   # Statistics calculations
│   ├── user.ts                    # User utilities
│   └── utils.ts                   # General utilities
│
├── public/                        # Static assets
│   ├── assets/                    # Images, SVGs, etc.
│   ├── font/                      # Custom fonts
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .next/                         # Build output (generated)
├── .vscode/                       # VS Code settings
├── .zencoder/                     # Zencoder workflow configs
├── .zenflow/                      # ZenFlow workflow configs
│
├── Configuration Files
│   ├── package.json               # Dependencies & scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.ts         # Tailwind CSS config
│   ├── next.config.ts             # Next.js configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── eslint.config.mjs           # ESLint rules
│   ├── .gitignore                 # Git ignore rules
│   ├── .env                       # Public environment variables
│   └── .env.local                 # Local environment overrides (git-ignored)
│
├── Documentation
│   ├── README.md                  # User-facing documentation
│   ├── ECONOMY_USAGE.md           # Economy system guide
│   └── repo.md                    # This file
│
└── Middleware
    └── middleware.ts              # Next.js request middleware (auth checks)
```

---

## 🔑 Key Features

### 1. **Authentication System**
- Login and signup flows
- OAuth support (callback handler)
- Protected routes via middleware
- User session management

**Files:** `app/auth/`, `lib/auth.ts`, `middleware.ts`

### 2. **Quiz System**
- **Multiple question types:**
  - Single choice
  - Multiple choice
  - True/False
  - Short answer
- Start quiz attempts
- Submit answers progressively
- View detailed results

**Files:** `app/quizzes/`, `lib/quiz.ts`, `components/QuizPlayer/`

### 3. **Economy System**
- **Diamond currency:** Buy/sell premium items
- **Energy system:** Limits quiz attempts (refills over time)
- **Shop:** Purchase virtual items
- Documented in `ECONOMY_USAGE.md`

**Files:** `hooks/useEconomy.ts`, `lib/economy.ts`, `app/shop/`

### 4. **Gamification**
- **Leaderboards:** Global ranking system
- **User stats:** Track performance
- **Categories:** Organize quizzes by topic
- **Account page:** View user profile and achievements

**Files:** `app/leaderboard/`, `hooks/useLeaderboard.ts`, `app/account/`

### 5. **Accessibility & Speech**
- **Text-to-Speech (TTS):** Read questions aloud
- **Speech-to-Text (STT):** Voice input for answers

**Files:** `hooks/useTTS.ts`, `hooks/useSTT.ts`

### 6. **Navigation**
- Sidebar navigation
- Bottom navigation (mobile)
- Quiz categories
- Journey/progress tracking

**Files:** `components/Sidebar/`, `components/BottomNav.tsx`, `app/categories/`

---

## 📡 API Integration

### Backend Connection
- **Base URL:** `http://localhost:4000` (configured via `NEXT_PUBLIC_API_URL`)
- **HTTP Client:** Axios
- **Data Fetching:** TanStack React Query

### Core Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Quizzes
- `GET /v1/quizzes` - Get all quizzes
- `GET /v1/quizzes/:id` - Get quiz details
- `GET /v1/quizzes/category/:id` - Get quizzes by category
- `POST /v1/quizzes/:id/start` - Start quiz attempt

#### Attempts (Quiz Sessions)
- `POST /v1/attempts/:id/answer` - Submit answer
- `POST /v1/attempts/:id/finish` - Complete attempt
- `GET /v1/attempts/:id/result` - Get attempt results

#### Economy
- `GET /user/economy` - Get energy & diamond balance
- `POST /user/energy/consume` - Use energy for quiz
- `POST /user/energy/refill` - Refill energy
- `POST /user/diamonds/purchase` - Buy diamonds
- `POST /user/diamonds/spend` - Spend diamonds

#### Leaderboard
- `GET /v1/leaderboard` - Get global rankings
- `GET /v1/leaderboard/user/:id` - Get user ranking

---

## 🎣 Custom Hooks

### `useEconomy()`
Manages user's currency and energy system.
```typescript
const { energy, maxEnergy, diamonds, refillEnergy, spendDiamonds } = useEconomy();
```

### `useGamemode()`
Tracks current game/quiz mode state.

### `useLeaderboard()`
Fetches and caches leaderboard data.

### `useTTS()`
Text-to-Speech functionality with Google API.
```typescript
const { speak, isSpeaking } = useTTS(text);
```

### `useSTT()`
Speech-to-Text input for accessibility.
```typescript
const { startListening, transcript, isListening } = useSTT();
```

### `useUser()`
Retrieves and caches current user data.

---

## ⚙️ Configuration

### Environment Variables

**`.env` (Public - committed to repo)**
```
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyDpc09szDuRW7khLC1brTZQNvuE-ZGQMg8
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**`.env.local` (Private - git-ignored)**
```
NEXT_PUBLIC_GOOGLE_API_KEY=...
NEXT_PUBLIC_API_URL=...
```

### TypeScript Configuration
- **Target:** ES2017
- **Module:** ESNext
- **Path Alias:** `@/*` → root directory
- **Strict mode:** Enabled

### Tailwind CSS
- **Version:** 4 with PostCSS plugin
- **Configured in:** `tailwind.config.ts`
- **Global styles:** `app/globals.css`

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts Next.js dev server on `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Prerequisites
- **Node.js:** v18+ (or as specified)
- **Backend API:** Running on `http://localhost:4000`
- **Google API Key:** For Text-to-Speech (in `.env`)

---

## 📝 Code Standards

- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with utility-first approach
- **Component Structure:** Functional components with hooks
- **State Management:** Zustand for global state, React Query for server state
- **Code Quality:** ESLint 9 with Next.js config

---

## 🔗 Related Documentation

- **Quiz Economy System:** See `ECONOMY_USAGE.md` for detailed energy/diamond usage
- **Setup Instructions:** See `README.md` for quick start guide
- **Project Root:** `/home/minohealth5/Downloads/sharks/sh-out`

---

## 📊 Project Stats

- **Total Dependencies:** 18
- **Dev Dependencies:** 6
- **Main Pages:** 11 (auth, home, quizzes, attempts, account, categories, leaderboard, shop)
- **Component Categories:** 9 (Auth, Home, Journey, LandingPage, LeaderBoard, QuizPlayer, Shop, Sidebar, UI)
- **Custom Hooks:** 6
- **Utility Modules:** 7

---

**Last Updated:** December 23, 2025

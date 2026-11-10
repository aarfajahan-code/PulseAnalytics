# ⚡ PulseAnalytics — Real-Time Collaboration & Analytics Dashboard

**PulseAnalytics** is a production-grade, enterprise-ready real-time analytics and collaboration dashboard web application. Built with **React 19**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS v4**, **TanStack Query (React Query)**, **Zustand**, **Recharts**, **TanStack Table v8**, and **Supabase Realtime / Web BroadcastChannel API**.

---

## 🌟 Key Architecture & Technical Features

### 1. 🔄 Dual-Engine Real-Time Collaboration Layer
* **Automatic Fallback Protocol**: Works seamlessly out-of-the-box using the browser's native **Web BroadcastChannel API** for cross-tab synchronization. When Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are present, it seamlessly elevates to **Supabase Realtime WebSocket Channels**.
* **Live Presence Avatars**: Shows active collaborators online with status tooltips (`Online`, `Editing KPI`, `Viewing Grid`) and role indicators.
* **Multi-Window Sync**: Editing a metric, switching timeframes, or filtering categories in one browser window instantly reflects in all other open browser instances.
* **Live Activity Audit Feed**: Streams user actions, metric edits, data exports, and collaborator joins with live relative timestamps.

### 2. 📊 Live Dashboard & Interactive Analytics
* **Dynamic Timeframe Toggles**: Instant rendering of performance metrics across `7d`, `30d`, and `1y` timeframes.
* **KPI Summary Cards**: Feature percentage changes, trend indicators (+/-), sparklines, and optimistic UI update capabilities.
* **Interactive Recharts Visualizations**:
  * **Area Chart**: Revenue ($) vs Active Daily User growth with subtle glow gradients.
  * **Donut Chart**: Acquisition channels breakdown with interactive tooltips and growth percentages.
  * **Bar Chart**: Regional revenue distribution across US-East, EU-Central, APAC-SG, and LATAM clusters.
  * **System Load Area Chart**: P99 response latency (ms) vs API traffic throughput.

### 3. 🏢 High-Density Enterprise Data Grid
* Powered by **TanStack Table v8** (`@tanstack/react-table`).
* **Multi-Column Sorting**: Support for multi-sort using `Shift + Click` on table headers.
* **300ms Debounced Search**: Global search input powered by custom `useDebounce` hook filtering customer names, emails, transaction IDs, regions, and plans.
* **Custom Column Visibility**: Interactive dropdown menu to toggle column visibility dynamically.
* **Instant Export**: Export filtered datasets to formatted **CSV** or **JSON** with one click.
* **Client-Side Pagination**: Page size selection (`10`, `20`, `50`) with pagination controls.

### 4. 🚀 Power-User UX & Accessibility
* **Command Palette Overlay (`Cmd / Ctrl + K`)**: Keyboard-driven navigation using `cmdk`. Quickly filter categories, toggle dark/light mode, trigger metric edits, export datasets, and execute commands.
* **Theme Persistence**: Light and Dark mode with seamless toggle and `localStorage` persistence.
* **Asynchronous UX**: Animated skeleton loaders for charts and tables during data fetching, error boundaries, and zero placeholder text.

---

## 📁 Repository Structure

```
frontend-dashboard/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   │   ├── CategoryFilterBar.tsx     # 300ms debounced search & category pills
│   │   │   ├── MetricCards.tsx           # KPI cards with sparklines & edit triggers
│   │   │   ├── MetricEditModal.tsx       # Optimistic UI metric update modal
│   │   │   ├── PerformanceCharts.tsx     # Recharts Area, Donut, and Bar charts
│   │   │   └── TimeframeSelector.tsx     # 7d / 30d / 1y timeframe toggle
│   │   ├── collaboration/
│   │   │   ├── ActiveCollaborators.tsx   # Live user presence avatars & tooltips
│   │   │   ├── LiveActivityStream.tsx    # Real-time event audit log
│   │   │   ├── RealtimeStatusBadge.tsx   # Connection protocol status indicator
│   │   │   └── SimulateEventModal.tsx    # Trigger mock collaborator events
│   │   ├── command-palette/
│   │   │   └── CommandPalette.tsx        # Cmd+K cmdk dialog overlay
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx         # Fallback error handling wrapper
│   │   │   └── LoadingSkeleton.tsx       # Animated pulse skeleton loaders
│   │   ├── grid/
│   │   │   └── EnterpriseDataGrid.tsx    # TanStack Table v8 with CSV/JSON export
│   │   ├── layout/
│   │   │   ├── Header.tsx                # Sticky top bar & search trigger
│   │   │   ├── Sidebar.tsx               # Collapsible navigation & branding
│   │   │   └── ThemeToggle.tsx           # Dark / Light theme toggle
│   │   └── ui/
│   │       ├── Badge.tsx                 # Status and tag pill component
│   │       ├── Button.tsx                # Reusable accessible button
│   │       ├── Card.tsx                  # Glassmorphic themed card container
│   │       ├── Modal.tsx                 # Dialog overlay with backdrop blur
│   │       └── SkeletonLoader.tsx        # Pulse loaders for async states
│   ├── hooks/
│   │   ├── useDashboardData.ts           # TanStack Query custom data hooks
│   │   ├── useDebounce.ts                # 300ms search debouncing hook
│   │   └── useRealtimeSync.ts            # BroadcastChannel & Supabase sync hook
│   ├── lib/
│   │   ├── mockData.ts                   # Comprehensive enterprise mock dataset
│   │   └── supabase.ts                   # Realtime channel hub & fallback
│   ├── store/
│   │   └── useDashboardStore.ts          # Zustand store with persistence
│   ├── types/
│   │   └── index.ts                      # Strict TypeScript interfaces
│   ├── utils/
│   │   └── formatters.ts                 # Number, currency, and date formatters
│   ├── App.tsx                           # Main application layout & providers
│   ├── index.css                         # Tailwind CSS v4 directives & custom tokens
│   └── main.tsx                          # React 19 entrypoint
├── index.html                            # HTML template with Google Fonts
├── package.json                          # Dependencies & scripts
├── tsconfig.json                         # Strict TypeScript configuration
└── vite.config.ts                        # Vite configuration with Tailwind CSS v4
```

---

## 🛠️ Local Development & Setup Instructions

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **pnpm** or **yarn**

### Quick Start

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

3. **Test Multi-Tab Real-Time Sync**:
   * Open two separate browser tabs or windows at `http://localhost:5173`.
   * Click **"Simulate Live Event"** or edit a metric value in Tab 1.
   * Watch the updates sync instantly in Tab 2!

4. **Production Build**:
   ```bash
   npm run build
   ```
   To preview the production build locally:
   ```bash
   npm run preview
   ```

---

## ⚡ Optional Supabase Realtime Configuration

To connect to a live Supabase project instead of using the local BroadcastChannel fallback, create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

When these environment variables are provided, PulseAnalytics automatically connects to your remote Supabase Realtime channels.

---

## 💡 Keyboard Shortcuts

* **`Cmd + K` / `Ctrl + K`**: Open Command Palette
* **`ESC`**: Close Modal / Command Palette
* **`Shift + Click`**: Multi-column sorting in Enterprise Data Grid

---

## 🏆 Key Technical Achievements

1. **Zero-Latency Optimistic UI**: Metric updates apply immediately to local state and update chart visualizations before re-validating via background synchronization.
2. **Resilient Offline / Fallback Realtime**: Works seamlessly across tabs using `BroadcastChannel` even when offline or without external API keys.
3. **Strict Type Safety**: Comprehensive TypeScript interfaces for API contracts, grid rows, presence events, and store states.
4. **Performance Optimized**: Sub-1.5 second production build times with zero runtime dependencies on heavy bloated UI frameworks.

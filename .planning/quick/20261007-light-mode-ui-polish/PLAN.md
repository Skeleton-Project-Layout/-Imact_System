# Quick Task Plan: Light Mode by Default & Premium UI Polish

## Problem Statement
The user requested: "can you make the website light mode . And make it pretty a little bit".
Currently:
1. The CSS variables and root layout default to a dark slate theme (`#0a0f1d`, `#111827`, `#1f293d`).
2. Several components have hardcoded dark colors (`#0f172a`, `color: '#ffffff'`, `color: '#f8fafc'`, `color: '#cbd5e1'`, etc.), which cause low contrast, unreadable text, or stark dark blocks when running in light mode.
3. The 5 governance and compliance views (`ExitBriefingsView.jsx`, `FactualCorrectionsView.jsx`, `ReviewerPackView.jsx`, `PrivacyIncidentsView.jsx`, `RetentionAndAuditView.jsx`) use utility class names that lacked comprehensive CSS support.
4. The visual aesthetics should be elevated to a premium, government-decision-support standard with rich civic prestige (tricolor/ashoka accent ribbon, elegant cards, refined typography, subtle glassmorphism, micro-animations, and an interactive Light/Dark theme toggle).

## Plan Architecture & Execution Steps

### 1. Theme Engine & Global Design Tokens (`frontend/src/index.css`)
- **Default Theme**: Set Light Mode as default on `:root` and `[data-theme="light"]`, with full dual-mode support for `[data-theme="dark"]`.
- **Light Theme Palette**:
  - `--bg-primary`: `#f8fafc` (Ultra-clean slate background)
  - `--bg-secondary`: `#ffffff` (Pure crisp white containers)
  - `--bg-card`: `#ffffff` (Crisp cards with subtle elevation)
  - `--bg-card-hover`: `#f1f5f9` (Soft hover state)
  - `--border-color`: `#e2e8f0` (Crisp, clean borders)
  - `--border-subtle`: `#f1f5f9`
  - `--border-strong`: `#cbd5e1`
  - `--text-main`: `#0f172a` (Slate-900, high contrast readability)
  - `--text-muted`: `#475569` (Slate-600)
  - `--text-dim`: `#64748b` (Slate-500)
  - `--brand-primary`: `#2563eb` (Royal Blue)
  - `--brand-accent`: `#d97706` (Amber / Saffron Gold)
  - High-contrast continuity band colors for light mode:
    - Green: `--band-green-bg: #ecfdf5; --band-green-text: #047857; --band-green-border: #a7f3d0;`
    - Amber: `--band-amber-bg: #fffbeb; --band-amber-text: #b45309; --band-amber-border: #fde68a;`
    - Red: `--band-red-bg: #fef2f2; --band-red-text: #b91c1c; --band-red-border: #fecaca;`
    - Blue: `--band-blue-bg: #eff6ff; --band-blue-text: #1d4ed8; --band-blue-border: #bfdbfe;`
- **Utility & Component Classes**:
  - Comprehensive definitions for flex, grid, spacing, badges, cards, buttons, modals, and status chips.
  - Full support for governance view classes (`bg-slate-900/90`, `bg-slate-950/70`, `text-slate-200`, `text-slate-400`, `text-white`, `border-slate-800`, `text-emerald-400`, `text-amber-300`, `text-rose-400`, etc.) mapped intelligently through CSS custom properties so they render beautifully in both light and dark modes.
  - National civic header accent banner (`tricolor-ribbon`).
  - Smooth transitions on buttons, cards, and theme switching.

### 2. Theme Toggle Controller (`ThemeToggle.jsx`)
- Create a reusable, elegant theme toggle button with Sun / Moon icons and tooltips.
- Persist state to `localStorage.getItem('abhisaran_theme') || 'light'`.
- Apply `data-theme="light"` or `data-theme="dark"` to `document.documentElement`.
- Embed into `LandingPage` (`App.jsx`), `AdminShell.jsx`, and `SourceShell.jsx`.

### 3. Component Color & Contrast Polish
- **`App.jsx` (Landing Page)**:
  - Add theme toggle in top header.
  - Add Ashoka/AEHT civic ribbon and stylized hero badge.
  - Update Front A and Front B cards with smooth card-lift hover transitions and soft glow.
  - Disclaimer banner updated to clean alert design.
- **`AdminShell.jsx` & Admin Views**:
  - Replace hardcoded dark backgrounds (`#0f172a`, `rgba(30, 41, 59, 0.7)`) and hardcoded white text (`color: '#ffffff'`) with theme CSS variables (`var(--bg-card)`, `var(--text-main)`, etc.).
  - Fix district selector dropdown, governance menu dropdown, and overview cards.
  - Update `ConvergenceHeatmap.jsx`, `ImpactPassportCard.jsx`, `TraceDrawer.jsx`, `ExplainScoreModal.jsx`, `AddDistrictModal.jsx` for light mode contrast.
- **`SourceShell.jsx` & Source Views**:
  - Replace hardcoded dark background (`#0b1120`) with theme variables.
  - Fix `QuestionCard.jsx`, `SchedulingGuard.jsx`, `ZeroPiiUploadModal.jsx`, `BaselineQuizModal.jsx` so inputs, options, and text are high-contrast and readable in light mode.

### 4. Verification & Testing
- Validate with `npm run build`.
- Verify light mode visual appearance and interactive functionality in browser via `browser_subagent`.
- Verify dark mode toggle smoothly shifts back and forth without visual regression.

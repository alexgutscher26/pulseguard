# PLAN-aesthetic-ui

> **Status**: APPROVED
> **Goal**: Implement "Cyberpunk/Sci-Fi" aesthetic enhancements including advanced theming, CRT effects, glitch typography, and interactive sound effects.

## 1. Context & Architecture

### 1.1 Objectives

- **Theming**: Move beyond simple Light/Dark to support "Matrix Green", "Cyberpunk Pink", and "Blade Runner Orange".
- **Visual FX**: authentic CRT scanlines and glitch effects that feel "premium" but do not block user interaction.
- **Audio FX**: Interactive feedback (success/fail/hover) using `use-sound` (Howler.js).
- **User Control**: All effects must be toggleable (reduced motion/sound off).

### 1.2 Tech Stack Decisions

- **State/Theming**: `next-themes` (likely already present, but needs expansion for multi-theme support beyond `light|dark`).
- **Styling**: `tailwind-merge` + CSS Variables for dynamic themes.
- **Audio**: `use-sound` hook (wrapper around Howler.js) for robust audio sprite and state management.
- **Motion**: CSS Animations for Scanlines (performant GPU layers), Framer Motion for Glitch transitions if needed (or pure CSS for lightweight).

---

## 2. Implementation Steps

### Phase 1: Foundation & Dependencies

- [ ] **Install Dependencies**
  - `npm install use-sound next-themes`
  - `npm install -D howler` (types)
- [ ] **Audit Existing Theme Provider**
  - Check `apps/web/components/theme-provider.tsx` (or equivalent).
  - Ensure it supports `themes={['light', 'dark', 'matrix', 'cyberpunk', 'blade']}`.
- [ ] **Asset Preparation**
  - Create `public/sounds/` directory.
  - Define list of required SFX (click, hover, success-blip, error-alarm, glitch-stutter).

### Phase 2: Advanced Theming Engine

- [ ] **CSS Variable Definition (`apps/web/app/globals.css`)**
  - Define new data-theme blocks:
    - `[data-theme='matrix']`: Primary=Neon Green, Bg=Deep Black, Font=Monospace.
    - `[data-theme='cyberpunk']`: Primary=Neon Pink, Secondary=Cyan, Bg=Dark Purple.
    - `[data-theme='blade']`: Primary=Neon Orange, Bg=Sepia/Black mix.
- [ ] **Tailwind Config Update**
  - Ensure colors map to CSS variables (e.g., `primary: 'var(--primary)'`) so they automatically switch with the theme.

### Phase 3: Visual Effects (The "Vibe")

- [ ] **Scanline Overlay Component**
  - Create `components/ui/effects/scanlines.tsx`.
  - **Specs**: Fixed position, `z-index: 50`, `pointer-events: none`, repeating linear-gradient + subtle animation.
  - **Context**: Connect to a "High Fidelity" or "Graphics" setting store (can use `useLocalStorage`).
- [ ] **Glitch Text Component**
  - Create `components/ui/effects/glitch-text.tsx`.
  - **Props**: `text`, `intensity` (low/med/high), `trigger` (onHover, loop, error states).
  - **Implementation**: Use `::before` and `::after` pseudo-elements with clip-path animations.

### Phase 4: Audio System

- [ ] **Sound Context/Hook**
  - Create `hooks/use-sfx.ts`.
  - **Features**:
    - Expose `play('success')`, `play('error')`.
    - Check global "Mute" state before playing.
  - **Settings**: Store user preference (`soundEnabled: boolean`) in local storage.
- [ ] **Global Sound Toggles**
  - Add Mute/Unmute button to the Settings or User Menu.

### Phase 5: Integration & Polish

- [ ] **Theme Switcher**
  - Create `components/theme-switcher.tsx`.
  - Dropdown or segmented control to swap between the 5 distinct themes.
- [ ] **404 Page Update**
  - Replace standard 404 with Glitch Text ("SYSTEM FAILURE // PAGE NOT FOUND").
- [ ] **Critical Error States**
  - Wrap error boundaries or toast notifications with the "Alarm" SFX.

---

## 3. Verification Checklist

### UX Verification

- [ ] **Toggle Check**: Can I turn off the sound? (Silence test)
- [ ] **Theme Check**: Does "Matrix" mode actually look green/black everywhere?
- [ ] **Interaction**: Do scanlines block clicks? (Must be `pointer-events-none`)
- [ ] **Persistence**: Do my settings (Theme/Sound) survive a page reload?

### Performance

- [ ] **Audio Lazy Loading**: Ensure sound files don't block Initial Content Paint.
- [ ] **CSS Painting**: Ensure scanlines don't cause massive repaints (use `transform` / `opacity`).

## 4. Agent Assignments

- **Frontend Specialist**: All Component and CSS work.
- **UX Designer**: Theme color palette selection and SFX selection.

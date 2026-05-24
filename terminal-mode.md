# Terminal-Only Mode: Retro Browser CLI

This plan outlines the design and implementation of a Terminal-Only Mode for the PulseGuard dashboard. It replaces the GUI widgets with an interactive, fullscreen CRT-style terminal prompt where operators can execute shell-like commands and watch live monitoring log streams.

---

## Success Criteria

1. **Dedicated Terminal Button**: Add a dedicated button/toggle in the dashboard header to enter and exit Terminal Mode.
2. **Interactive CLI Prompt**: monospaced terminal prompt (`operator@pulseguard:~$ `) with blinking cursor, supporting typing, ArrowUp/ArrowDown command history, and auto-focus.
3. **Immersive Cyberpunk Aesthetics**: Deep black CRT display style, green glow/amber terminal text options, scanning lines overlay, and custom ASCII welcome banner.
4. **Interactive Commands**: Support execution of:
   - `help`: Print command manual.
   - `ls` / `list`: Monospaced table of active monitors.
   - `check <id>`: Trigger check on a monitor with live output response.
   - `logs <id>`: Tail recent latency logs for a monitor.
   - `clear`: Clear console history.
   - `exit`: Turn off terminal mode.
5. **Live Log Streaming**: Stream real-time WebSocket check updates to the terminal when idle (simulating `tail -f`).

---

## Project Type

**WEB** (Next.js web application)

---

## Tech Stack

- **Framework**: Next.js, React 19
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4, Custom CSS (scanline animation, flickering cursor)
- **Icons**: Lucide Icons

---

## Proposed Changes

### [Component Name] Dashboard Terminal Integration

#### [NEW] [use-terminal-store.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/hooks/use-terminal-store.ts)
Create a global Zustand store to coordinate the active state of Terminal-Only Mode.

#### [NEW] [terminal-view.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/components/dashboard/terminal-view.tsx)
Create the fullscreen terminal shell displaying command history logs, welcome headers, scanline filter overlays, inputs, and autocomplete handlers.

#### [MODIFY] [header.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/components/dashboard/header.tsx)
Add the dedicated terminal launch button on the header toolbar.

#### [MODIFY] [layout.tsx](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/%28app%29/layout.tsx)
Integrate the `<TerminalView />` overlay which covers the screen when Terminal-Only Mode is active.

---

## Task Breakdown

### Task 1: Scaffolding Store & Header Trigger
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Priority**: P1
- **Dependencies**: None
- **INPUT**: Current UI header.
- **OUTPUT**: Zustand store for terminal toggle and header launch button.
- **VERIFY**: Clicking the header button successfully logs/toggles terminal state.

### Task 2: Fullscreen Shell & CRT Styles
- **Agent**: `frontend-specialist`
- **Skills**: `ui-ux-pro-max`, `frontend-design`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Zustand terminal state.
- **OUTPUT**: Fullscreen overlay with scanlines, blinking cursor, and ASCII welcome splash.
- **VERIFY**: Enabling terminal mode overlays the entire viewport with a dark CRT screen.

### Task 3: Interactive CLI Command Parser
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **Priority**: P1
- **Dependencies**: Task 2
- **INPUT**: Custom terminal terminal input.
- **OUTPUT**: Command parsing loop supporting `help`, `clear`, `exit`, `ls` (fetching and printing monitors), `check <id>` (calling server action to run checks), and history tracking (ArrowUp/Down).
- **VERIFY**: Typing commands displays outputs and executes actual triggers against server actions.

### Task 4: Real-time Event Streaming
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **Priority**: P2
- **Dependencies**: Task 3
- **INPUT**: Live check updates.
- **OUTPUT**: Listen to monitor update notifications and print raw logs dynamically to console when idle.
- **VERIFY**: Terminal lists live status codes and timings in real-time.

### Task 5: Master Checklist & Tests
- **Agent**: `test-engineer`
- **Skills**: `webapp-testing`
- **Priority**: P3
- **Dependencies**: Task 4
- **INPUT**: Finished terminal mode system.
- **OUTPUT**: Script audits and Next compilation passes.
- **VERIFY**: `checklist.py` succeeds.

---

## Verification Plan

### Automated Tests
- Run validation suite: `python .agent/scripts/checklist.py .`
- Test build process: `bun run build` in web package.

### Manual Verification
- Toggle Terminal Mode via button.
- Type `help`, run `ls`, verify list of monitors.
- Execute `check <id>` to trigger manual check.
- Use `clear` and verify screen reset.
- Press `exit` to return to GUI.

---

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass (New files checked cleanly; other unrelated workspace files contain existing errors)
- Security: ✅ No critical issues (Passed security scan verification)
- Build: ✅ Success
- Date: 2026-05-24


# Progress Log

## Current Verified State

- Standard startup path: `./init.sh` — exits 0
- Standard verification path: `npm run check` (tsc --noEmit) — exits 0
- Current highest-priority unfinished feature: none (all tasks passing)
- Current blocker: none

## Session Log

### Session 0035

- Date: 2026-05-11
- Goal: Implement `add-lunar-phase` task — add lunar phase display to TITHI card
- Completed:
  - DailyView.tsx: imported `Moon` from `lunarphase-js`
  - DailyView.tsx: moved TITHI card into `anga-top-row` alongside TIME card; both get `flex:1` for 50% width at tablet/desktop, 100% at mobile
  - DailyView.tsx: TITHI label uses `anga-card__label--split` — left shows `Moon.lunarPhaseEmoji(now)` emoji, right has faMoon icon + TITHI text
  - DailyView.tsx: MASA-SAMVATSARA moved from `anga-top-row` into new `anga-half-row` wrapper; constrained to `calc(50% - 0.5rem)` at tablet/desktop, 100% at mobile
  - DailyView.css: added `anga-card--tithi` to flex rule; added `.anga-half-row` + responsive overrides; added `.anga-card__label--split`, `.anga-card__label-right`, `.lunar-phase-emoji`
- Verification run: `npm run check` exits 0; 1 test passed
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit and all tasks are complete

### Session 0036

- Date: 2026-05-11
- Goal: Implement `add-settings` task — gear icon in header with Time + Theme callout
- Completed:
  - Created Settings.tsx: gear icon button, callout with Time toggle + separator + Theme toggle; closes on click-outside/Esc/re-click; icon highlighted when open
  - Created Settings.css: callout layout (absolute, right-aligned, secondary bg, 14rem min-width, z-index 200)
  - index.css: moved theme-toggle and time-format-toggle CSS here from Sidebar.css and DailyView.css (shared by Settings, Sidebar, DailyView)
  - App.tsx: lifted timeFormat state + toggleTimeFormat; passed to Header and DailyView
  - Header.tsx: added theme/timeFormat props; renders Settings at rightmost end of header top
  - DailyView.tsx: removed internal timeFormat state; accepts timeFormat + onToggleTimeFormat as props
  - CitySearch.css: margin-left:auto → flex:1 (fills space left of Settings); mobile: order:99 + flex:0 0 100% (wraps to row 2, Settings stays row 1)
- Verification run: npm run check exits 0; 1 test passed
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/components/Settings.tsx, src/styles/Settings.css, src/styles/index.css, src/styles/Sidebar.css, src/styles/DailyView.css, src/components/Header.tsx, src/pages/DailyView.tsx, src/App.tsx, src/styles/CitySearch.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit

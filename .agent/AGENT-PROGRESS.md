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

### Session 0037

- Date: 2026-05-13
- Goal: Implement `add-sun-and-moon-sign` task — sunRashi + moonRashi in core and DailyView card
- Completed:
  - panchangam.ts: replaced single `rashi` field with `sunRashi` and `moonRashi` on Panchangam interface; computed via `RASHIS[floor(sunSidereal/30)%12]` and `RASHIS[floor(moonSidereal/30)%12]`
  - DailyView.tsx: imported all 12 FA zodiac icons + faSun + faMoon; added RASHI_ICON and RASHI_ENGLISH lookup maps; added full-row Sun Rashi / Moon Rashi card (two sections, centered, zodiac icon + Sanskrit name + English subvalue)
  - Tests: replaced `rashi` assertion with `sunRashi` ("Meṣa") and `moonRashi` ("Makara") assertions in both amanta and purnimanta test cases
  - task_list.yaml: status set to passing with evidence
- Verification run: npm run build exits 0; npm run test — 2 tests passing
- Known risk or unresolved issue: none
- Next best step: commit changes

### Session 0038

- Date: 2026-05-13
- Goal: Complete `add-lunar-system` and `add-sun-and-moon-sign` tasks end-to-end

#### Lunar System toggle (add-lunar-system)
- constants.ts: added `LunarSystem = "amanta" | "purnimanta"` type and `LUNAR_SYSTEM_KEY`
- App.tsx: added `lunarSystem` state with `getInitialLunarSystem` (reads localStorage) and `toggleLunarSystem`; passed through to Header and DailyView
- Settings.tsx: added Lunar System toggle row between Time and Theme; uses `lunarphase-js` Moon.emojiForLunarPhase — 🌑 (new moon) for Amānta, 🌕 (full moon) for Pūrṇimānta; slider physically moves left↔right
- index.css: added `lunar-system-toggle` CSS (7rem wide, thumb translates 5rem for purnimanta, label at 0.75rem offset)
- Header.tsx: threads `lunarSystem` + `onToggleLunarSystem` props through to Settings

#### Calculations update
- panchangam.ts: added `lunarSystem: LunarSystem` param (4th, before `useSunrise`) to `computePanchangam`; `computeMasa` shifts masa index by +1 for purnimanta; both use imported `LunarSystem` type from constants
- panchangam.ts: added `RASHIS` array and `sunRashi`/`moonRashi` fields to `Panchangam` interface computed via `RASHIS[floor(sidereal/30)%12]`
- Panchangam interface field renames (by user): `ayane`→`ayana`, `ritau`→`ritu`, `mase`→`masa`; paksha values `"Shukla"`/`"Krishna"` → `"Śukla"`/`"Kṛṣṇa"`
- DailyView.tsx: passes `lunarSystem` prop to `computePanchangam`; added `useMemo` dep
- Sankalpam.tsx: reads `lunarSystem` directly from localStorage via `LUNAR_SYSTEM_KEY`; updated field references to `ayana`, `ritu`, `masa`

#### Sun/Moon Rashi card in DailyView
- Imported all 12 FA zodiac icons + `faSun` + `faMoon` + `IconDefinition`
- Added `RASHI: Record<string, { icon: IconDefinition; zodiacName: string }>` lookup combining icon and English zodiac name
- Added full-row Sun Rashi / Moon Rashi card at bottom of anga-grid: two sections, each 50% width (`rashi-card__section: flex: 0 0 calc(50% - 0.75rem)`), centered; label = planet icon + "SUN/MOON RASHI", value = zodiac icon + Sanskrit name, subvalue = English zodiac name
- DailyView.css: added `.rashi-card__header` and `.rashi-card__section` rules

#### Tests
- panchangam.test.ts: uses `Panchangam` interface directly (no separate `ExpectedPanchangam`); `assertCommon(result, expected: Panchangam)` asserts all fields including `tithi.number`, `tithi.paksha`, `sunRashi`, `moonRashi`
- Two test cases: amanta (`masa="Vaiśākha"`) and purnimanta (`masa="Jyeṣṭha"`); both assert `sunRashi="Meṣa"`, `moonRashi="Makara"` for May 08 2026 Virginia reference

- Verification run: `npm run build` exits 0; `npm run test` — 2 tests passing
- Known risk or unresolved issue: none
- Next best step: commit all changes

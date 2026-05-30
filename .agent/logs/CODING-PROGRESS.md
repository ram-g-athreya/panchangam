# Coding Progress Log

## Current Verified State

- Standard startup path: `./init.sh` — exits 0
- Standard verification path: `npm run check` — exits 0; 4 tests passing
- Current highest-priority unfinished feature: none (all 7 tasks passing)
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

### Session 0039

- Date: 2026-05-16
- Goal: Implement `find-starbirth-day-ui` task — Find My Star Birthday panel in DailyView
- Completed:
  - CitySearch.tsx: added `CitySearchProps` interface with `saveToStorage?: boolean` and `onLocationSelect?: (data: LocationData) => void`; initial display value driven by `saveToStorage`; `handleSelect` writes to localStorage only when `saveToStorage=true`, always calls `onLocationSelect`; `handleBlur` reverts using `displayValueRef` for non-storage instances
  - DailyView.tsx: imported CitySearch; added `FindStarBirthdayPanel` function component with state for `birthDateTime` (string) and `birthLocation` (LocationData | null); renders Birth Date & Time datetime-local input, Birth City CitySearch (saveToStorage=false), Current City CitySearch (default, syncs global location); Find Star Birthday button disabled until all fields filled
  - DailyView.css: updated `.daily-view` to `display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start`; combined `.panchang-panel, .star-birthday-panel` responsive widths (`100%` / `calc(50% - 0.5rem)` / `33.333%`); added `.star-birthday-form`, `.star-birthday-form__field`, `.star-birthday-form__label`, `.star-birthday-form__datetime`, `.star-birthday-form__btn` styles; `.star-birthday-panel .city-search` override for full-width city search
- Verification run: `npm run check` exits 0; 2 tests passing
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/components/CitySearch.tsx, src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit changes

### Session 0040

- Date: 2026-05-16
- Goal: Implement computeStarBirthday algorithm and wire it up in FindStarBirthdayPanel
- Completed:
  - Installed `@photostructure/tz-lookup` dependency
  - panchangam.ts: added `StarBirthdayResult` interface; `parseZonedToUTC` helper (converts "YYYY-MM-DDTHH:mm" in a given IANA timezone to UTC using Intl.DateTimeFormat offset trick); `computeStarBirthday` — looks up birth timezone, parses birth datetime, computes birth panchangam, gets birth nakshatra, starts search from yesterday's sunrise at current location, estimates JD for moon reaching birth nakshatra zone (mod360 distance / SPEED_MOON), finds first calendar day with matching sunrise nakshatra (offset loop 0–2), returns { birthNakshatra, starBirthday }
  - DailyView.tsx: imported computeStarBirthday + StarBirthdayResult; updated getLocation() to return full LocationData; added currentLocation state (initialized from localStorage) + setCurrentLocation callback for Current City CitySearch; handleFind() calls computeStarBirthday with both locations; result state renders a card below the button
  - DailyView.css: added .star-birthday-result, .star-birthday-result__nakshatra, .star-birthday-result__date styles
- Verification run: npm run check exits 0; 2 tests passing
- Evidence captured: task_list.yaml updated
- Files updated: src/core/panchangam.ts, src/pages/DailyView.tsx, src/styles/DailyView.css, package.json, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit changes

### Session 0041

- Date: 2026-05-16
- Goal: Finalize find-starbirth-day-ui — name field, button styling, localStorage persistence, button press feedback
- Completed:
  - DailyView.tsx: added `name` state + text input field; `StoredStarBirthday` interface; `getStoredStarBirthdayData()` helper; `useEffect` persists `name`, `birthDateTime`, `birthLocation` on every change; `handleFind` merges computed result into stored JSON; all fields pre-populated from localStorage on mount; `dateTimeInputRef` + `openDatePicker()` via showPicker(); `allFilled` guard requires name non-empty
  - DailyView.tsx: result card redesigned as two-section flex row (`star-birthday-result__section` + `star-birthday-result__divider`) using existing anga-card label/value/sub classes
  - CitySearch.tsx: added `initialValue` prop; `getInitialDisplay()` returns initialValue if provided, else stored/empty; `displayValueRef` tracks confirmed display for blur-revert on non-storage instances
  - DailyView.css: `.star-birthday-form__text` for name input; `.star-birthday-form__datetime-wrapper` relative container; icon `position: absolute; left: 0.6rem; z-index: 1; cursor: pointer`; input `padding-left: 2rem`; `::-webkit-calendar-picker-indicator { display: none }`; `.star-birthday-form__btn` with `align-self: center`; button `transition: background-color 1s ease, color 1s ease, transform 1s ease, opacity 0.2s ease`; `:active:not(:disabled)` sets pressed colors + `transition: none` for instant press + 1s release return; `.star-birthday-result` flex row; `.star-birthday-result__section` + `.star-birthday-result__divider`
- Verification run: npm run check exits 0; 2 tests passing
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, src/components/CitySearch.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit all find-starbirth-day-ui changes

### Session 0044

- Date: 2026-05-17
- Goal: Styling refinements for `consolidate-ui` — align CSS with evolving spec and UI style guide
- Completed:
  - DailyView.css: `align-items: stretch` on `.daily-view` so both panels match height per spec
  - DailyView.tsx: added "Vasare" after `{v(p.vara)}` to match spec template exactly
  - Sankalpam title: changed from `h2` to `h1`, added `font-family: "Samarkan", serif` and `text-align: center`; section gets `padding: 1rem`
  - Sankalpam text: `font-size: 1.15rem` (was 1rem → 1.5rem → 1rem through iterations), `letter-spacing: 0.025em`, `line-height: 1.8`; no per-element padding (section handles it)
  - Sankalpam strong: `font-size: 1.25rem` (settled after spec updates from 1.75 → 1.15 → 1.25)
  - Find Star Birthday: wrapped in `div.find-birthday-section` with tertiary bg, 1rem padding, border-radius 6px, shadow; city-search selector updated to `.find-birthday-section .city-search`
  - `.star-birthday-result`: changed background from tertiary to secondary to contrast against tertiary section bg
  - Removed intermediate parchment wrapper approach (`.sankalpam-section__parchment`) — spec was updated to use section-level bg instead
- Verification run: `npm run check` exits 0; 4 tests passing
- Evidence captured: task_list.yaml `consolidate-ui` evidence updated
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit all changes since Session 0042

### Session 0043

- Date: 2026-05-17
- Goal: Implement `consolidate-ui` task — move Sankalpam to home page, remove Sankalpam page, remove hamburger icon
- Completed:
  - DailyView.tsx: imported `Panchangam` type; renamed `FindStarBirthdayPanel` to `SidePanel` (accepts `panchangam` prop); added Sankalpam section at top of the panel using `p` (samvatsare, ayana, ritu, masa, tithi, vara, nakshatra, yoga, karana); `v()` helper renders bold strong tags
  - DailyView.css: added `.sankalpam-section`, `.sankalpam-section__title`, `.sankalpam-section__text` (accent color, 1.5rem font, 4rem padding, parchment bg via tertiary, mobile override 1.5rem padding), `.sankalpam-section__text strong` (1.75rem)
  - Header.tsx: removed `faBars` import, `barsIcon`, `library.add(faBars)`, `onOpenSidebar` prop, and hamburger button JSX; removed `FontAwesomeIcon` import (no longer needed)
  - Header.css: removed `.header__hamburger` rule
  - App.tsx: removed `Sidebar` and `Sankalpam` imports; removed `sidebarOpen` state and `setSidebarOpen`; removed `<Sidebar>` render; removed `/sankalpam` route; removed `onOpenSidebar` prop from Header
  - Deleted: src/pages/Sankalpam.tsx, src/styles/Sankalpam.css, src/components/Sidebar.tsx, src/styles/Sidebar.css
- Verification run: `npm run check` exits 0; 4 tests passing
- Evidence captured: task_list.yaml `consolidate-ui` status set to passing
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, src/components/Header.tsx, src/styles/Header.css, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit changes

### Session 0042

- Date: 2026-05-17
- Goal: Add second star birthday test case, meta assertions, and implement `store-and-retrieve-names` task
- Completed:
  - panchangam.test.ts: added second `computeStarBirthday` test — birth 1990-10-06T07:20 in Thanjavur, current Virginia; asserts `birthNakshatra="Aśvinī"` and `starBirthday.toDateString()` equals "Wed Oct 28 2026"
  - panchangam.test.ts: replaced `console.log({ meta })` in `assertCommon` with three `toBeCloseTo(…, 4)` assertions for `meta.sunSidereal`, `meta.moonSidereal`, `meta.elongation`; both computePanchangam test cases already had expected `meta` values populated
  - DailyView.tsx: replaced `StoredStarBirthday` single-object pattern with `StoredProfile[]` array (max 5, most-recent-first, deduped by `name`); `getStoredProfiles()` + `saveProfiles()` helpers; removed auto-save `useEffect`; profiles saved only on button click in `handleFind`; added `birthCityKey` state (increments on pill load to force CitySearch remount with correct `initialValue`)
  - DailyView.tsx: pills rendered between title and form — `star-birthday-pills` div with one `star-birthday-pill` per profile; name button calls `loadProfile` (sets name/birthDateTime/birthLocation + bumps key); × button calls `removeProfile` (filters array, writes localStorage); pills hidden when array empty
  - DailyView.css: added `.star-birthday-pills`, `.star-birthday-pill`, `.star-birthday-pill__name`, `.star-birthday-pill__remove` styles (accent border, 999px radius, separator between name/remove, hover states); title margin-bottom reduced to 0.5rem
  - panchangam.ts: removed unused `LUNAR_SYNODIC_PERIOD` constant; changed `let startJD` → `const startJD` (pre-existing lint errors)
- Verification run: `npm run check` exits 0; 4 tests passing (up from 2)
- Evidence captured: task_list.yaml `store-and-retrieve-names` status set to passing
- Files updated: tests/unit-tests/src/core/panchangam.test.ts, src/pages/DailyView.tsx, src/styles/DailyView.css, src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit

### Session 0045

- Date: 2026-05-17
- Goal: Implement `add-rahu-kalam-and-yama-kandam` task end-to-end
- Completed:
  - panchangam.ts: added `TimeRange` interface (`start`, `end: Date`); added optional `rahuKalam?: TimeRange` and `yamaKandam?: TimeRange` to `Panchangam` interface; added `RAHU_KALAM_PART = [8,2,7,5,6,4,3]` and `YAMA_KANDAM_PART = [5,4,3,2,1,7,6]` lookup arrays indexed by JS day-of-week (0=Sun…6=Sat); `computePanchangam` computes both ranges when sunRise/sunSet available: `partMs = (sunSet - sunRise) / 8`, picks 1-based part index per day table
  - DailyView.tsx: added `formatTimeRange` helper (undefined → "Set your city"; uses `formatTime` with `displaySecond` param added by user for seconds toggle); added full-row Rahu Kalam / Yama Gandam card reusing `rashi-card__header` + `rashi-card__section` layout with `kalam-card__header` modifier; icon labels use `<span className="kalam-icon kalam-icon--snake|bull" />` (CSS mask-image spans, no inline SVG)
  - DailyView.css: added `.kalam-icon` (mask-size/repeat/position, `background-color: currentColor`), `.kalam-icon--snake` (`mask-image: url("/icons/snake.svg")`), `.kalam-icon--bull` (`mask-image: url("/icons/bull-horns.svg")`); added `.kalam-card__header .anga-card__value { font-size: 0.85rem }` to prevent long time-range strings overflowing
  - panchangam.test.ts: added `KALAM_TOLERANCE_MS = 60_000` constant; `assertCommon` now asserts `rahuKalam` and `yamaKandam` defined + `start`/`end` within tolerance; both amanta and purnimanta test cases include expected kalam values from spec
- Verification run: `npm run check` exits 0; 4 tests passing
- Evidence captured: task_list.yaml `add-rahu-kalam-and-yama-kandam` status set to passing with updated evidence
- Files updated: src/core/panchangam.ts, src/pages/DailyView.tsx, src/styles/DailyView.css, tests/unit-tests/src/core/panchangam.test.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit all changes

### Session 0046

- Date: 2026-05-17
- Goal: Implement `add-footer` task — Footer component with three social/feedback icon links
- Completed:
  - Installed `@fortawesome/free-brands-svg-icons` for `faGithub` and `faXTwitter`
  - Created `src/components/Footer.tsx`: renders `<footer>` with three `<a>` links; icons from FA solid (`faMessage`) and FA brands (`faGithub`, `faXTwitter`); each opens in new tab with `rel="noopener noreferrer"`; `aria-label` on each link
  - Created `src/styles/Footer.css`: flex row centered, `gap: 1.5rem`, `padding: 1rem 0.75rem`, secondary bg, accent color at `1.25rem`, hover `opacity: 0.7`
  - `App.tsx`: imported `Footer`; rendered `<Footer />` between `<Routes>` and `<Analytics />`
- Verification run: `npm run check` exits 0; 4 tests passing
- Evidence captured: task_list.yaml `add-footer` status set to passing
- Files updated: src/components/Footer.tsx, src/styles/Footer.css, src/App.tsx, package.json, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: commit all changes

### Session 0047

- Date: 2026-05-29
- Goal: Implement `save-star-birthday-to-calendar` task — "Add to Calendar" button below star birthday result
- Completed:
  - DailyView.tsx: added `faCalendarPlus` + `faDownload` to FA solid imports
  - DailyView.tsx: added 6 helper functions — `toICSDateString` (YYYYMMDD), `toISO8601Date` (YYYY-MM-DD), `nextDay`, `buildGoogleCalendarUrl` (calendar.google.com/calendar/render, all-day date range), `buildOutlookUrl` (outlook.live.com/calendar/0/deeplink/compose, allday=true), `downloadICS` (RFC 5545 VCALENDAR blob download)
  - DailyView.tsx: added `showCalendarOptions` state to SidePanel; reset to false in `compute()` on each new result
  - DailyView.tsx: wrapped result block in Fragment; added `add-to-calendar` div after result — toggle button opens options row with Google Calendar `<a>`, Outlook `<a>`, and Download .ics `<button>`; event title `{name}'s Nakshatra Birthday`
  - DailyView.css: added `.add-to-calendar`, `.add-to-calendar__btn`, `.add-to-calendar__options`, `.add-to-calendar__option` styles
- Verification run: `npm run check` exits 0; 11 tests passing
- Evidence captured: task_list.yaml `save-star-birthday-to-calendar` status set to ready_for_review
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/logs/CODING-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: reviewer approves, then commit

### Session 0048

- Date: 2026-05-29
- Goal: Rework `save-star-birthday-to-calendar` — replace toggle button+list with split dropdown button per updated spec
- Completed:
  - DailyView.tsx: added `faChevronDown` import
  - DailyView.tsx: added `calendarRef` (HTMLDivElement) and click-outside `useEffect` — registers `mousedown` listener only while dropdown is open, closes on click outside container
  - DailyView.tsx: replaced single toggle button + options list with split button structure: left `<a>` (add-to-calendar__primary) directly opens Google Calendar as default action; right `<button>` (add-to-calendar__chevron) toggles the dropdown; each dropdown option closes dropdown on click
  - DailyView.tsx: dropdown label strings updated to "Add to Google Calendar", "Add to Outlook", "Download .ics" per spec
  - DailyView.css: removed .add-to-calendar__btn + .add-to-calendar__options; added .add-to-calendar__split-btn (flex, overflow hidden), .add-to-calendar__primary (left half link), .add-to-calendar__chevron (right half button with border-left separator), .add-to-calendar__dropdown (position absolute, z-index 10, shadow, centered below button)
- Verification run: `npm run check` exits 0; 11 tests passing
- Evidence captured: task_list.yaml status set to ready_for_review
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/logs/CODING-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: reviewer approves, then commit

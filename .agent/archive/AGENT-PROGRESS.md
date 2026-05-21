# Progress Log
**THIS IS FOR BOOKKEEPING PURPOSES DO NOT USE IT FOR ANY ACTIVE TASKS**

## Session Log

### Session 0001

- Date: 2026-05-03
- Goal: Build minimal single-page React/Vite/TypeScript app shell titled "Panchangam"
- Completed:
  - Updated package.json (type: module, added react-dom, @vitejs/plugin-react@6, @types/react, @types/react-dom, scripts: dev/build/check/test)
  - Created tsconfig.json (strict mode, jsx: react-jsx, noEmit)
  - Created vite.config.ts with @vitejs/plugin-react
  - Created index.html with <title>Panchangam</title>
  - Created src/App.tsx — named export App, renders <h1>Panchangam</h1>
  - Created src/main.tsx — mounts App into #root
  - Created src/vite-env.d.ts — reference types for Vite client (CSS imports)
  - Created styles/index.css — minimal reset
- Verification run: `./init.sh` and `npm run check` both exit 0
- Evidence captured: task_list.yaml status set to passing
- Commits: feat: scaffold Panchangam React/Vite/TS app shell
- Files or artifacts updated: package.json, tsconfig.json, vite.config.ts, index.html, src/App.tsx, src/main.tsx, src/vite-env.d.ts, styles/index.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: add more features to the Panchangam app (calendar data, date display, etc.)

### Session 0002

- Date: 2026-05-03
- Goal: Implement `basic-styling` task — apply sepia color palette from UI-STYLE.md
- Completed:
  - Updated src/styles/index.css with CSS custom properties for all five sepia colors
  - Applied bg-main and text-primary to body; accent color to headings
- Verification run: `npm run check` exits 0
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/styles/index.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: add Panchangam calendar data features (Tithi, Nakshatra, date display)

### Session 0003

- Date: 2026-05-04
- Goal: Implement `add-header` task — Header component with Samarkan font
- Completed:
  - Created src/components/Header.tsx — named export Header, renders "Panchangam" in Samarkan font
  - Created src/styles/Header.css — @font-face for samarkan woff/ttf, padding: 8rem, secondary bg, accent text
  - Updated src/App.tsx to import and render <Header />
- Verification run: `npm run check` exits 0
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/components/Header.tsx, src/styles/Header.css, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: add Panchangam calendar data features (Tithi, Nakshatra, date display)

### Session 0004

- Date: 2026-05-04
- Goal: Implement `daily-panchangam-display` — show all five angas for today
- Completed:
  - Created src/core/panchangam.ts — Julian Day, Meeus sun/moon longitude, computes Tithi, Vara, Nakshatra, Yoga, Karana
  - Created src/pages/DailyView.tsx — card grid with anga values and Sanskrit names
  - Created src/styles/DailyView.css — responsive card layout using sepia palette variables
  - Updated src/App.tsx to render <DailyView /> below <Header />
  - Marked add-header task passing
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/core/panchangam.ts, src/pages/DailyView.tsx, src/styles/DailyView.css, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk: Karana model cycles only the 8 movable karanas; 4 fixed karanas not yet modelled
- Next best step: date navigation (prev/next day) or improve Karana accuracy

### Session 0005

- Date: 2026-05-04
- Goal: Implement `update-header` task — apply updated spec from src/components/ARCHITECTURE.md
- Completed:
  - Header.css: padding 8rem → 1rem
  - Header.css: font-size 2rem → 2.5rem
  - Header.css: letter-spacing 0.05em → 0em
  - @font-face kept in index.css (user had already moved it there; no duplicate in Header.css)
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml status set to passing
- Files updated: src/styles/Header.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: date navigation or Karana accuracy improvement

### Session 0006

- Date: 2026-05-04
- Goal: Implement `dark-theme` task — add dark theme and toggle
- Completed:
  - src/styles/index.css: added `[data-theme="dark"]` block with all five dark palette variables from UI-STYLE.md
  - src/App.tsx: added `useState<Theme>` + `useEffect` to set `data-theme` on `document.documentElement`; passes `theme` and `onToggleTheme` to Header
  - src/components/Header.tsx: accepts `HeaderProps` (`theme`, `onToggleTheme`); renders ☽/☀ toggle button
  - src/styles/Header.css: added `.header__theme-toggle` styles
- Verification run: npm run check exits 0
- Files updated: src/styles/index.css, src/App.tsx, src/components/Header.tsx, src/styles/Header.css, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: Karana model still uses only 8 movable karanas
- Next best step: date navigation (prev/next day)

### Session 0007

- Date: 2026-05-04
- Goal: Implement `update-light-dark-toggle` — replace text toggle with FontAwesome icons per ARCHITECTURE.md spec
- Completed:
  - Installed @fortawesome/react-fontawesome, @fortawesome/fontawesome-svg-core, @fortawesome/free-solid-svg-icons
  - Header.tsx: library.add(faSun, faMoon), findIconDefinition for fas/sun and fas/moon, FontAwesomeIcon component
  - Header.css: toggle is a circular button with --color-bg-main background (changes automatically with theme)
- Verification run: npm run check exits 0
- Files updated: src/components/Header.tsx, src/styles/Header.css, package.json, package-lock.json, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk: byPrefixAndName is not a public FA export; findIconDefinition is the equivalent public API
- Next best step: date navigation (prev/next day)

### Session 0008

- Date: 2026-05-04
- Goal: Implement `update-light-dark-toggle-interaction` — slider toggle per updated ARCHITECTURE.md spec
- Completed:
  - Header.tsx: track contains sun icon (left), sliding thumb, moon icon (right)
  - Header.css: pill-shaped .theme-toggle with --color-bg-main background; .theme-toggle\_\_thumb slides via translateX(2.1rem) in dark mode; 0.25s ease transition
- Verification run: npm run check exits 0
- Files updated: src/components/Header.tsx, src/styles/Header.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: date navigation (prev/next day)

### Session 0009

- Date: 2026-05-04
- Goal: Update `add-card-icons` task — add FA icons to all card labels and apply updated label styling from `src/pages/ARCHITECTURE.md`
- Completed:
  - DailyView.tsx: imported FontAwesomeIcon + faClock, faMoon, faSun, faStar, faInfinity, faScaleBalanced
  - Clock card: label div with faClock icon + time-format-toggle button
  - Remaining 5 cards: label span with FA icon + uppercase card name (TITHI, VARA, NAKSHATRA, YOGA, KARANA)
  - DailyView.css: .anga-card\_\_label updated to display:flex, align-items:center, gap:0.45rem, font-size:1rem, font-weight:bold
  - .anga-card\_\_label svg: flex-shrink:0 (icons inherit 1rem font-size from label)
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml add-card-icons evidence updated
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: date navigation (prev/next day) or new feature from task list

### Session 0010

- Date: 2026-05-04
- Goal: Implement `update-panchangam-calculations` — extend Panchangam with namasamvatsare, ayane, ritau, mase per `src/core/ARCHITECTURE.md`
- Completed:
  - Added SAMVATSARAS (60 Jovian year names), MASAS (12 solar months), RITUS (6 seasons) constant arrays
  - computeNamasamvatsare: approximates VS year from Gregorian date, indexes into 60-name samvatsara cycle
  - computeAyane: Uttarayana when sun < 90° or >= 270°, Dakshinayana otherwise
  - computeRitau: 6 ritus by 60° solar longitude bands starting from Mesha
  - computeMase: saura masa by 30° solar longitude bands starting from Mesha (Chaitra)
  - Panchangam interface extended with namasamvatsare, ayane, ritau, mase
  - computePanchangam returns all new fields
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-panchangam-calculations set to passing
- Files updated: src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk: namasamvatsare uses Mar 22 as Chaitra approximation; true start varies by ~3 weeks year to year
- Next best step: surface new fields in DailyView UI, or date navigation

### Session 0011

- Date: 2026-05-04
- Goal: Implement `implement-sankalpam-page` — Sankalpam page per `src/pages/ARCHITECTURE.md`
- Completed:
  - Created src/pages/Sankalpam.tsx — computes Panchangam for current moment, renders title + sankalpam text
  - Created src/styles/Sankalpam.css — title: Samarkan 2rem primary color centered; text: Samarkan 1rem accent color centered; both letter-spacing 0em
  - App.tsx: added `/sankalpam` route mapping to Sankalpam component
  - Sankalpam string follows template: namasamvatsare, ayane, ritau, mase, paksha, tithi, vara, nakshatra, yoga, karana
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml implement-sankalpam-page set to passing
- Files updated: src/pages/Sankalpam.tsx, src/styles/Sankalpam.css, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: surface new panchangam fields in DailyView, or add navigation link to Sankalpam page

### Session 0012

- Date: 2026-05-04
- Goal: Iterative Sankalpam page updates per `src/pages/ARCHITECTURE.md`
- Completed:
  - Sankalpam.css: title font-size 2rem → 4rem
  - Sankalpam.tsx: removed Samarkan font-family from text; switched plain string to JSX with bold variables via `<strong>`
  - Sankalpam.css: text font-size 1rem → 1.5rem
  - Sankalpam.css: added parchment background (--color-bg-secondary), padding 4rem, border-radius, box-shadow
  - Sankalpam.css: added .sankalpam\_\_text strong { font-size: 1.75rem } for bold variable sizing
- Verification run: npm run check exits 0
- Files updated: src/pages/Sankalpam.tsx, src/styles/Sankalpam.css, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: add navigation link to Sankalpam from DailyView, or new task

### Session 0013

- Date: 2026-05-05
- Goal: Implement `implement-navigation-links` — nav panel per `src/components/ARCHITECTURE.md`
- Completed:
  - Header.tsx: imported NavLink; added .header\_\_nav panel with Home → /home and Sankalpam → /sankalpam links
  - Header.tsx: navClass applies --active modifier when isActive
  - Header.css: header restructured to flex column; .header**top flex row for title + toggle; .header**nav below with border-top
  - Header.css: .header\_\_nav-link--active gets underline + primary text color
  - App.tsx: added /home route rendering DailyView
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml implement-navigation-links evidence updated
- Files updated: src/components/Header.tsx, src/styles/Header.css, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: new task from task list or further UI refinements

### Session 0014

- Date: 2026-05-05
- Goal: Implement `update-navigation-links-styling` — tertiary background colour + nav link styling per UI-STYLE.md and components ARCHITECTURE.md
- Completed:
  - index.css: added --color-bg-tertiary to :root (#dccab2) and [data-theme="dark"] (#3d2b1f)
  - Header.css: .header\_\_nav uses var(--color-bg-tertiary) as background; removed border-top
  - Header.css: .header\_\_nav-link--active gains text-underline-offset: 0.3rem
  - Header.tsx: Home NavLink target changed from /home to / per updated spec
  - App.tsx: removed /home route (Home now maps to /)
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-navigation-links-styling set to passing
- Files updated: src/styles/index.css, src/styles/Header.css, src/components/Header.tsx, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: new task from task list

### Session 0015

- Date: 2026-05-05
- Goal: Implement `update-panchangam-algorithm` — full Nirayana (sidereal) coordinate system with Lahiri Ayanamsha per `src/core/ARCHITECTURE.md`
- Completed:
  - lahiriAyanamsha(T): `23.85 + 1.396*T + 0.000308*T²` — Lahiri precession correction
  - Renamed sunLongitude/moonLongitude to tropicalSunLongitude/tropicalMoonLongitude for clarity
  - siderealLongitude(tropical, T): subtracts Lahiri ayanamsha from tropical longitude, mod360
  - computePanchangam: derives sunSidereal and moonSidereal; all five angas (plus ayane/ritau/mase) now use sidereal coordinates
  - Tithi: tithiIndex 14 → "Purnima", 29 → "Amavasya" (per spec; previously paksha-conditional)
  - Nakshatra: floor(moonSidereal / 13.3333) per spec (was (moonLong/360)\*27)
  - Yoga: floor(yogaSum / 13.3333) per spec (was (sum/360)\*27)
  - Karana: computeKarana() implements full 60-karana model — index 0 = Kimstughna (fixed), 57 = Shakuni, 58 = Chatushpada, 59 = Naga; indices 1–56 cycle through 7 repeating karanas
  - KARANAS constant replaced with REPEATING_KARANAS (7 names: Bava…Vishti; removed Bhadra)
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-panchangam-algorithm set to passing
- Files updated: src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: namasamvatsare still uses Gregorian Mar 22 approximation for Chaitra start
- Next best step: all tasks now passing; check task_list.yaml for any new additions

### Session 0016

- Date: 2026-05-05
- Goal: Implement `update-panchangam-algorithm-consider-local-time` — compute planetary positions at local sunrise rather than the current moment
- Completed:
  - panchangam.ts: added dayOfYear(date) — 1-based UTC day of year, used in sunrise algorithm
  - panchangam.ts: added computeSunriseJD(date, lat, lon) — NOAA zenith-based algorithm; returns JD of sunrise in UTC; falls back to solar noon if sun never rises/sets
  - panchangam.ts: added DEFAULT_LATITUDE (12.9716) and DEFAULT_LONGITUDE (77.5946) — Bangalore as reference city
  - panchangam.ts: computePanchangam signature extended to (date, latitude?, longitude?) with Bangalore defaults
  - panchangam.ts: all planetary position JD now derives from computeSunriseJD, not toJulianDay(date)
  - Existing callers (DailyView.tsx, Sankalpam.tsx) require no change — default params apply
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-panchangam-algorithm-consider-local-time set to passing
- Files updated: src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk: sunrise algorithm uses simplified NOAA formula (±1–2 min accuracy); good enough for panchangam anga determination
- Next best step: all tasks now passing; check task_list.yaml for any new additions

### Session 0017

- Date: 2026-05-05
- Goal: Implement `restructure-header` — move theme toggle to bottom panel per `src/components/ARCHITECTURE.md`
- Completed:
  - Header.tsx: removed theme-toggle button from header__top; placed it inside header__nav after the NavLinks
  - Header.css: added align-items:center to .header__nav so toggle and nav links sit on the same baseline
  - Header.css: .header__title font-size 2.5rem → 2rem per spec
  - theme-toggle already had margin-left:auto, pushing it flush right in the nav panel
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml restructure-header set to passing
- Files updated: src/components/Header.tsx, src/styles/Header.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0018

- Date: 2026-05-05
- Goal: Implement `restructure-header-add-navigation-sidebar` — move nav links + toggle to a dedicated Sidebar overlay per updated `src/components/ARCHITECTURE.md`
- Completed:
  - Header.tsx: stripped to hamburger button (faBars) + Panchangam title; accepts onOpenSidebar prop; padding 1rem 0.5rem
  - Header.css: removed all .header__nav, .header__nav-link, theme-toggle styles; added .header__hamburger
  - Created src/components/Sidebar.tsx: overlay sidebar; nav links Home (faHouse) and Sankalpam (faPersonPraying); theme toggle at bottom; closes on overlay click or nav click
  - Created src/styles/Sidebar.css: fixed overlay with 40% black bg; sidebar panel 16rem wide, tertiary bg; active link gets secondary bg; theme-toggle styles live here
  - App.tsx: added sidebarOpen state; passes onOpenSidebar to Header; renders Sidebar at root level so it covers all pages
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml restructure-header-add-navigation-sidebar evidence added
- Files updated: src/components/Header.tsx, src/styles/Header.css, src/components/Sidebar.tsx, src/styles/Sidebar.css, src/App.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0019

- Date: 2026-05-05
- Goal: Implement `update-sidebar` — fix Sankalpam icon and add 0.5s slide transition
- Completed:
  - Sidebar.tsx: swapped faPersonPraying → faHandsPraying (spec: "hands praying NOT person praying")
  - Sidebar.tsx: removed conditional `if (!isOpen) return null`; sidebar always rendered so CSS transition can play
  - Sidebar.tsx: applies .sidebar-overlay--open and .sidebar--open via isOpen prop
  - Sidebar.css: .sidebar-overlay transitions opacity 0→1 (0.5s ease); pointer-events none when closed prevents stray clicks
  - Sidebar.css: .sidebar transitions translateX(-100%)→translateX(0) (0.5s ease) for the slide-in effect
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-sidebar set to passing
- Files updated: src/components/Sidebar.tsx, src/styles/Sidebar.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0020

- Date: 2026-05-05
- Goal: Implement `city-search-ui` — city search text box in header with geocoding and localStorage persistence
- Completed:
  - constants.ts: added LocationData interface {city, latitude, longitude} and LOCATION_KEY
  - Created src/components/CitySearch.tsx: input with faLocationDot icon; reads city name from localStorage on init; on blur geocodes via Open-Meteo API (no API key needed) and stores full LocationData to localStorage
  - Created src/styles/CitySearch.css: flex row with bg-main background, accent icon, margin-left:auto positions it flush right
  - Header.tsx: imported and rendered <CitySearch /> inside header__top so it appears on the right side
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml city-search-ui set to passing
- Files updated: src/constants.ts, src/components/CitySearch.tsx, src/styles/CitySearch.css, src/components/Header.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk: geocoding silently fails if city is ambiguous or API is unavailable; stored value is unchanged in that case
- Next best step: all tasks now passing; await new tasks

### Session 0021

- Date: 2026-05-05
- Goal: Implement `update-styling-city-search-ui` — fix CitySearch sizing and add responsive behaviour
- Completed:
  - CitySearch.css: gap 0.5rem → 0 (no gap between icon and input per spec)
  - CitySearch.css: height:2rem on .city-search; padding adjusted to 0 0.6rem
  - CitySearch.css: font-size 0.9rem → 1rem on icon and input
  - CitySearch.css: added @media (max-width:640px) — CitySearch takes full row width, margin-left reset to 0
  - Header.css: added flex-wrap:wrap to .header__top so CitySearch can flow to next line on small screens
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-styling-city-search-ui set to passing
- Files updated: src/styles/CitySearch.css, src/styles/Header.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0022

- Date: 2026-05-05
- Goal: Implement `search-bar-interaction` — full autocomplete with Nominatim, focus-clear, blur-restore
- Completed:
  - CitySearch.tsx: onFocus clears input value; selectedRef tracks whether user chose a suggestion
  - CitySearch.tsx: onChange debounces 300ms; calls Nominatim after >2 chars; shows dropdown list
  - CitySearch.tsx: onMouseDown on suggestion (fires before blur) stores {city, lat, lon} to localStorage, clears list
  - CitySearch.tsx: onBlur (150ms delay) restores stored city name if no selection was made
  - CitySearch.tsx: useEffect cleans up debounce timer on unmount
  - CitySearch.css: added .city-search__wrapper (relative) to anchor absolute dropdown; .city-search__suggestions and .city-search__suggestion styles
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml search-bar-interaction set to passing
- Files updated: src/components/CitySearch.tsx, src/styles/CitySearch.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk: Nominatim has a 1 req/s fair-use policy; debounce at 300ms is acceptable for normal typing
- Next best step: all tasks now passing; await new tasks

### Session 0023

- Date: 2026-05-05
- Goal: Apply two spec updates from src/components/ARCHITECTURE.md to city search (no new task added)
- Completed:
  - CitySearch.tsx: added NominatimAddress interface; Nominatim request now includes addressdetails=1
  - CitySearch.tsx: added formatSuggestion() — builds "city, state, country" from address fields (falling back through city→town→village→hamlet and state→county)
  - CitySearch.tsx: handleSelect uses address fields for the stored city name (not display_name split)
  - CitySearch.tsx: dropdown items render formatSuggestion(s.address) instead of s.display_name
  - CitySearch.css: added min-width:25rem to .city-search per spec
- Verification run: npm run check exits 0
- Files updated: src/components/CitySearch.tsx, src/styles/CitySearch.css, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0024

- Date: 2026-05-05
- Goal: Apply updated spec to CitySearch — Photon Komoot API, loading spinner, suggestions same width as search bar
- Completed:
  - CitySearch.tsx: switched from Nominatim to Photon Komoot API (https://photon.komoot.io/api/); limit=7; GeoJSON FeatureCollection response
  - CitySearch.tsx: added isLoading state; set true before fetch, false in finally block; cleared on blur
  - CitySearch.tsx: moved suggestions list outside .city-search__wrapper into .city-search so it anchors to the full container width
  - CitySearch.tsx: formatSuggestion uses PhotonProperties (name, state, country); handleSelect uses geometry.coordinates[1/0] for lat/lon
  - CitySearch.css: .city-search now position:relative; suggestions positioned left:0 right:0 top:100% — exactly same width as search bar
  - CitySearch.css: added .city-search__spinner with CSS @keyframes spin animation; shown on right of input while loading
  - CitySearch.css: .city-search__input uses flex:1 min-width:0 to fill available space
- Verification run: npm run check exits 0
- Files updated: src/components/CitySearch.tsx, src/styles/CitySearch.css, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0025

- Date: 2026-05-05
- Goal: Apply spec update — store country in localStorage and display "city, country" in search box
- Completed:
  - constants.ts: added country field to LocationData interface
  - CitySearch.tsx: renamed getStoredCity → getStoredDisplay; returns "city, country" format when both fields present
  - CitySearch.tsx: handleSelect now stores country from feature.properties.country and sets inputValue to "city, country"
  - CitySearch.tsx: handleBlur restore uses getStoredDisplay() for "city, country" format
- Verification run: npm run check exits 0
- Files updated: src/constants.ts, src/components/CitySearch.tsx, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0026

- Date: 2026-05-05
- Goal: Apply spec update — placeholder changed to "Enter city for accuracy"
- Completed:
  - CitySearch.tsx: placeholder "Enter City Name" → "Enter city for accuracy"
- Verification run: npm run check exits 0
- Files updated: src/components/CitySearch.tsx, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0027

- Date: 2026-05-05
- Goal: Implement `use-location-to-compute-panchangam` — pass stored lat/lon to computePanchangam in both pages
- Completed:
  - panchangam.ts: computePanchangam(date, latitude?, longitude?) — optional params; uses computeSunriseJD when both provided, toJulianDay(date) otherwise; no hardcoded fallback location
  - DailyView.tsx: getLocation() returns {latitude, longitude} from localStorage LOCATION_KEY or null; passes location?.latitude, location?.longitude to computePanchangam
  - Sankalpam.tsx: same getLocation() pattern and call
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml use-location-to-compute-panchangam set to passing
- Files updated: src/core/panchangam.ts, src/pages/DailyView.tsx, src/pages/Sankalpam.tsx, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0028

- Date: 2026-05-06
- Goal: Implement `update-panchangam-calculation` — precision algorithm update per `src/core/ARCHITECTURE.md`
- Completed:
  - lahiriAyanamsha: updated coefficients 23.85 → 23.85944, 1.396 → 1.396333, 0.000308 → 0.0003088
  - tropicalSunLongitude: M formula simplified (removed T² term); C — first coefficient drops T² term, second term is plain 0.019993, third term 0.000289 → 0.000101
  - tropicalMoonLongitude: all 5 fundamental arguments updated to spec-exact coefficients; correction trimmed to exactly 9 spec terms (4 extra terms removed)
  - computeSunriseJD: zenith 90.833 → 90.8333 (90°50') per spec
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-panchangam-calculation set to passing
- Files updated: src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0029

- Date: 2026-05-06
- Goal: Apply Section 5 refined implementation rules from updated `src/core/ARCHITECTURE.md`
- Completed:
  - computeSunriseDateForDay: renamed from computeSunriseJD; now returns Date instead of JD
  - computeGoverningsunrise: new helper — if input date is before today's sunrise, returns yesterday's sunrise (Temporal Anchoring rule)
  - computePanchangam: uses sunriseDate for all calculations; vara uses sunriseDate.getUTCDay() (not input date.getDay())
  - computeNamasamvatsare: switched to Shaka-based formula — Shaka = Gregorian - 78 (adj -1 before Chaitra), Index = (Shaka + 12) % 60; uses sunriseDate UTC fields
  - NAKSHATRA_WIDTH constant = 360/27; Nakshatra and Yoga indices now use it instead of 13.3333
- Verification run: npm run check exits 0
- Evidence captured: task_list.yaml update-panchangam-calculation evidence updated
- Files updated: src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0030

- Date: 2026-05-07
- Goal: Review updated `src/core/ARCHITECTURE.md` (spec reformatted sun longitude section) against current implementation
- Completed:
  - Verified tropicalSunLongitude already matches new spec exactly: L0 280.46646+36000.76983*T, M 357.5291092+35999.0502909*T, C (1.914602-0.004817*T)*sin(M)+0.019993*sin(2M)+0.000101*sin(3M)
  - No code changes required — spec was a clarification rewrite, not a formula change
  - Consolidated duplicate task_list.yaml entry; updated evidence with 2026-05-07 verification
- Verification run: npm run check exits 0
- Files updated: .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0031

- Date: 2026-05-08
- Goal: Implement `add-test-cases` — add vitest infrastructure and the reference test case per `tests/unit-tests/src/core/ARCHITECTURE.md`
- Completed:
  - Installed vitest@4.1.5
  - vite.config.ts: switched `defineConfig` import to `vitest/config`; added `test: { include: ["tests/**/*.test.ts"], environment: "node" }`
  - tsconfig.json: added "tests" and "vite.config.ts" to `include` array so tsc type-checks test files
  - package.json: `test` script updated to `vitest run && npm run check`
  - src/core/panchangam.ts: `Panchangam` interface extended with `sunSidereal: number` and `moonSidereal: number`; both fields included in `computePanchangam` return
  - Created tests/unit-tests/src/core/panchangam.test.ts: asserts `|sunSidereal - 24.10| ≤ 0.02` and `|moonSidereal - 283.41| ≤ 0.06` for the reference date
- Verification run: vitest run exits 0 (1 test passed); npm run check exits 0; ./init.sh exits 0
- Evidence captured: task_list.yaml add-test-cases status set to passing
- Files updated: vite.config.ts, tsconfig.json, package.json, src/core/panchangam.ts, tests/unit-tests/src/core/panchangam.test.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks now passing; await new tasks

### Session 0032

- Date: 2026-05-08
- Goal: Update test to cover all spec-required fields in a single `it` block per `.agent/ARCHITECTURE.md` ("all expected output should be verified within the same test")
- Completed:
  - Consolidated 3 separate `it` blocks into one test case
  - Test now asserts: tithi.name, vara, nakshatra, karana, ayane, ritau, sunSidereal (±0.02°), moonSidereal (±0.06°)
  - yoga and mase remain commented out in spec — not asserted
- Verification run: vitest run exits 0 (1 test passed)
- Files updated: tests/unit-tests/src/core/panchangam.test.ts, .agent/ARCHITECTURE.md, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks passing; await new tasks

### Session 0033

- Date: 2026-05-08
- Goal: Add sunRise and sunSet fields to Panchangam per updated src/core/ARCHITECTURE.md
- Completed:
  - panchangam.ts: refactored computeSunriseDateForDay into computeSolarEventDateForDay(isRise) — shared NOAA algorithm; isRise controls t (6h vs 18h guess) and H (west vs east meridian side)
  - panchangam.ts: added computeSunriseDateForDay and computeSunsetDateForDay as thin wrappers
  - panchangam.ts: Panchangam interface extended with sunRise?: Date and sunSet?: Date
  - panchangam.ts: computePanchangam computes and returns sunRise/sunSet when lat/lon are provided; undefined otherwise
- Verification run: npm run check exits 0 (tsc + lint + vitest); 1 test passed
- Evidence captured: task_list.yaml add-sunrise-sunset-to-panchangam set to passing
- Files updated: src/core/panchangam.ts, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: all tasks passing; await new tasks

### Session 0034

- Date: 2026-05-10
- Goal: Implement updated DailyView spec — merge Clock/Sunrise/Sunset into one full-row card with 3 sections
- Completed:
  - DailyView.tsx: replaced separate Clock, Sunrise, Sunset cards with a single full-row card containing 3 sections (TIME, SUNRISE, SUNSET) and a 12/24-hour toggle at the end
  - DailyView.tsx: each section has its own icon+label and value; date shown as subvalue spanning full width
  - DailyView.css: added .time-card__header (flex, wrap, gap 1.5rem) and .time-card__section (flex column, flex 1) for 3-section layout
  - task_list.yaml: removed duplicate not_started entry; update-daily-view remains passing
- Verification run: npm run check exits 0 (tsc + lint + vitest); 1 test passed
- Evidence captured: task_list.yaml update-daily-view status confirmed passing
- Files updated: src/pages/DailyView.tsx, src/styles/DailyView.css, .agent/task_list.yaml, .agent/AGENT-PROGRESS.md
- Known risk or unresolved issue: none
- Next best step: await new tasks or spec updates

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

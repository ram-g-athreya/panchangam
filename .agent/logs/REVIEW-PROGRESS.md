# Review Progress Log

## Current Verified State

- Standard startup path: `./init.sh` — exits 0
- Standard verification path: `npm run check` — exits 0; 11 tests passing
- Current highest-priority unfinished feature: center-lunar-toggle-wdiget-properly — approved (3rd attempt)
- Current blocker: none

## Session Log

### Session R001

- Date: 2026-05-29
- Task: `save-star-birthday-to-calendar`
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `changes_requested`
- Finding:
  - DRY violation in `src/pages/DailyView.tsx` lines 385, 395, 405 — the template literal
    `` `${name}'s Nakshatra Birthday` `` is repeated verbatim three times (once each for
    Google Calendar, Outlook, and ICS download). Introduce `const eventTitle = \`${name}'s Nakshatra Birthday\`` before the JSX block and replace all three usages.
- No other issues found. All spec requirements satisfied: three calendar options present, correct URL formats, RFC 5545-compliant ICS blob, `showCalendarOptions` resets on each new compute, event title matches spec.

### Session R003

- Date: 2026-05-29
- Task: `save-star-birthday-to-calendar` (re-review after split button re-implementation)
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- No issues found. Split button pattern correctly implemented: primary `<a>` for direct Google Calendar link, chevron toggles dropdown, click-outside useEffect cleans up properly, `aria-label` on chevron, all three options close dropdown on click, `eventTitle` const reused at all call sites, `showCalendarOptions` resets on each new compute. All imports used.

### Session R002

- Date: 2026-05-29
- Task: `save-star-birthday-to-calendar` (re-review after changes_requested fix)
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- Confirmed fix: `const eventTitle = \`${name}'s Nakshatra Birthday\`` extracted at line 269; all three call sites (lines 386, 394, 403) reference it. DRY violation resolved. No further issues.

### Session R008

- Date: 2026-05-31
- Task: `center-lunar-toggle-wdiget-properly` (3rd attempt)
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- `index.css` thumb unchanged from R007: `text-align:center + line-height:1.6rem` ✓.
  New addition: `DailyView.css` `.find-birthday-section .lunar-system-toggle { align-self: flex-start }`.
  This correctly prevents `align-items:stretch` from expanding the `<button>` to full cross-axis
  width in column-flex containers (browser-inconsistent behaviour with explicit `width: 7rem` on
  `<button>`). `flex-start` keeps the toggle left-aligned at its natural 7rem — correctly
  distinct from the rejected `align-self:center`. Pure CSS change — no tests required.

### Session R007

- Date: 2026-05-31
- Task: `center-lunar-toggle-wdiget-properly` (re-implementation)
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- New implementation swapped `display:flex + align-items:center + justify-content:center + line-height:1`
  for `text-align:center + line-height:1.6rem` (height equals line-height = vertical center).
  Both approaches are correct; the new one is simpler and more idiomatic for centering a single
  text node in a fixed-size circle. `font-size:1rem` retained. DailyView.css has no
  `.lunar-system-toggle` rule — toggle widget correctly left-aligned in the form.
  Pure CSS change — no tests required.

### Session R006

- Date: 2026-05-31
- Task: `center-lunar-toggle-wdiget-properly`
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- No issues found.
  1. `DailyView.css`: `.find-birthday-section .lunar-system-toggle` rule is absent — toggle widget
     is correctly left-aligned within the star birthday form (reverts the erroneous previous centering).
  2. `index.css` `.lunar-system-toggle__thumb`: retains `display:flex + align-items:center +
     justify-content:center + line-height:1` — moon emoji is correctly centered both vertically
     and horizontally within the circular thumb, satisfying the spec requirement. Pure CSS change —
     no tests required.

### Session R005

- Date: 2026-05-31
- Task: `center-lunar-toggle-wdiget`
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- No issues found. Two targeted CSS-only changes:
  1. `index.css` line 204: `line-height:1` on `.lunar-system-toggle__thumb` — correctly neutralizes
     the emoji's inherent line-height offset without conflicting with the existing
     `align-items/justify-content:center` flex centering on the thumb.
  2. `DailyView.css` lines 196-198: `.find-birthday-section .lunar-system-toggle { align-self: center }` —
     properly scoped to avoid affecting the Settings panel toggle; works correctly within the
     column-flex `.star-birthday-form__field` parent (default `align-items:stretch` would
     otherwise stretch the 7rem-wide toggle to full width). No tests required.

### Session R004

- Date: 2026-05-31
- Task: `add-ui-change-for-expiry`
- Verification: `npm run check` exits 0; 11 tests passing
- Outcome: `approved`
- No issues found. Expiry logic `endTime && now > endTime` is correctly applied to NAKSHATRA
  (line 601), YOGA (line 617), and KARANA (line 636) map entries in `DailyView.tsx`. The
  guard prevents a bogus comparison when `endTime` is undefined. CSS rules
  `.anga-entry--expired .anga-card__value` and `.anga-entry--expired .anga-card__sub`
  correctly scope `text-decoration: line-through` and `opacity: 0.5`. The `now` state
  ticks every second so expiry reflects in real time. Pure UI class toggle — no tests
  required.


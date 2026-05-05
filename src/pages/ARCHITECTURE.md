# ARCHITECTURE.md

## DailyView

Specification for the `DailyView` page. Derive the Panchangam by using the `computePanchangam` method for the current moment

### Information Cards

Displays 6 information cards of the same size with a label, value and sub. The cards must be responsive and together the panel should not exceed the width of the page

```yaml
- label:
    - Display a toggle switch with the text saying 12-hour or 24-hour in the background and being 12-hour by default.
    - Based on the value chosen the value below needs to change to 12-hour or 24-hour format
    - Store the value in localStorage and rehydrate on startup
    - Ensure that the storage key is in the constants file and imported
  value:
    - current time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
    - current time in 24-hour format of `hh:mm:ss` if 24 hour format is set
  subvalue: "current date in the format"
  requirements: "the date and time should update every second"
- label: TITHI
  value: "current tithi"
  subvalue: "current paksha along with number"
  requirements: "based on Panchangam derived above"
- label: VARA
  value: "current vara"
  subvalue: ""
  requirements: "based on Panchangam derived above"
- label: NAKSHATRA
  value: "current nakshatra"
  subvalue: ""
  requirements: "based on Panchangam derived above"
- label: YOGA
  value: "current yoga"
  subvalue: ""
  requirements: "based on Panchangam derived above"
- label: KARANA
  value: "current karana"
  subvalue: ""
  requirements: "based on Panchangam derived above"
```

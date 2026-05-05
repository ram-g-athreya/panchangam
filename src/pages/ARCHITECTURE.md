# ARCHITECTURE.md

## DailyView

Specification for the `DailyView` page. Derive the Panchangam by using the `computePanchangam` method for the current moment

### Information Cards

Displays 6 information cards of the same size in a single row in desktop resolution with a label, value and sub:

```yaml
- label: ""
  value: "current time in the format of `hh:mm:ss`"
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

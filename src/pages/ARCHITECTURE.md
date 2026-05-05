# ARCHITECTURE.md

All pages have the header component on top.

## DailyView

Specification for the `DailyView` page. Derive the Panchangam by using the `computePanchangam` method for the current moment

### Information Cards

- Displays information cards of the same size with a label, value and sub
- The cards must be responsive and the panel should not exceed the width of the page
- All icons should be of font-size `1rem`.
- Labels should be of font-size `1rem` and `bold`.

```yaml
- label:
    - Clock icon followed by a toggle switch with the text saying 12-hour or 24-hour in the background and being 12-hour by default.
    - Based on the value chosen the value below needs to change to 12-hour or 24-hour format
    - Store the value in localStorage and rehydrate on startup
    - Ensure that the storage key is in the constants file and imported
  value:
    - current time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
    - current time in 24-hour format of `hh:mm:ss` if 24 hour format is set
  subvalue: "current date in the format"
  requirements: "the date and time should update every second"
- label: moon icon followed by the word TITHI
  value: "current tithi"
  subvalue: "current paksha along with number"
  requirements: "based on Panchangam derived above"
- label: sun icon followed by the word VARA
  value: "current vara"
  subvalue: ""
  requirements: "based on Panchangam derived above"
- label: star icon followed by the word NAKSHATRA
  value: "current nakshatra"
  subvalue: ""
  requirements: "based on Panchangam derived above"
- label: infinity icon followed by the word YOGA
  value: "current yoga"
  subvalue: ""
  requirements: "based on Panchangam derived above"
- label: scale-balanced icon followed by the word KARANA
  value: "current karana"
  subvalue: ""
  requirements: "based on Panchangam derived above"
```

## Sankalpam

Specification for the `Sankalpam` page. Derive the Panchangam by using the `computePanchangam` method for the current moment

### Title

- The title has the word `Sankalpam` and is centered
- `font-family` should be `Samarkan`
- uses the `primary` color
- has `font-size` of `2rem`
- `letter-spacing` of `0em`

### Sankalpam Text

Based on the computed panchangam generate the Sankalpam based on the template below:

- Replace the variables between {{ }} with the corresponding attribute from the Panchangam object.
- `font-family` should be `Samarkan`
- uses the `accent` color
- has `font-size` of `1rem`
- `letter-spacing` of `0em`

```
{{ namasamvatsare }} Namasamvatsare, {{ ayane }}, {{ ritau }} Ritau, {{ mase }} Mase, {{ pakshe }} Pakshe, {{ tithi }} Tithau, {{ vara }} Vasare, {{ nakshatra }} Nakshatre, {{ yoga }} Yoge, {{ karana }} Karane
```

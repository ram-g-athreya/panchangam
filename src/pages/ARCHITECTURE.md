# ARCHITECTURE.md

All pages have the header component on top and the navigation sidebar initially hidden.

## DailyView

Specification for the `DailyView` page.

- Derive the Panchangam by using the `computePanchangam` method for the current moment with the `latitude` and `longitude` if stored in localstorage.
- Padding should be `1rem`

### Panchang for Today

This panel gives the basic Panchang information for today.

- Its width should span 33.333% in desktop, 50% in tablets and 100% in mobile
- Background color for the panel should be the secondary background color
- Information is presented as cards where information is grouped based on the context
- The Panel should have the title `Panchangam for Today`
- On the right side of the title should be a toggle switch with the text saying 12-hour or 24-hour in the background and being 12-hour by default.
- Based on the value chosen the value below needs to change to 12-hour or 24-hour format
- Store the value in localStorage and rehydrate on startup
- Ensure that the storage key is in the constants file and imported

#### Information Cards

- Displays information cards of the same size with a label, value and sub
- The cards must be responsive and the panel should not exceed the width of the page
- The cards shouldn't exceed 50% width of the panel unless otherwise specified
- Background color should be the tertiary background color
- All icons should be of font-size `1rem`.
- Labels should be of font-size `1rem` and `bold`.
- Padding for each card should be `1rem`
- Card should have a minimum width of `165px`
- The card should wrap to the next row if the width overflows outside the panel
- The icons used can be from fontawesome or bootstrap icons
- Bootstrap icons should have a font-size of `1.5rem`
- Gap between cards should be `1rem`

```yaml
- label:
    - Clock icon (fontawesome) followed by TIME
    - width should be 50% if desktop and tablet and 100% in mobile
  value:
    - First section should be the current time
    - Second section should be the sunrise time
    - Third section should be the sunset time
  subvalue: current date in the format
  requirements:
    - the TIME value should update every second
    - all values should change based on the 12-hour, 24-hour toggle
    - time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
    - time in 24-hour format of `hh:mm:ss` if 24 hour format is set
- label: calendar icon (fontawesome) followed by MASA - SAMVATSARA
  value: current masa - current samvatsara
  requirements: the width of the card should span 50% in desktop and tablet and 100% in mobile
- label:
  - width should be entire row
  - label should be split into 2 sections
  - First section is sunrise-fill icon (bootstrap icons) followed by the word SUNRISE
  - Secon sections is sunset-fill icon (bootstrap icons) followed by the word SUNSET
requirements:
  - all values should change based on the 12-hour, 24-hour toggle
  - time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
  - time in 24-hour format of `hh:mm:ss` if 24 hour format is set
  - If the value is undefined then set a placeholder text that user should set their city
- label: moon icon (fontawesome) followed by the word TITHI
  value: "current tithi"
  subvalue: "current paksha along with number"
  requirements: based on Panchangam derived above
- label: sun icon (fontawesome) followed by the word VARA
  value: "current vara"
  requirements: based on Panchangam derived above
- label: star icon (fontawesome) followed by the word NAKSHATRA
  value: "current nakshatra"
  requirements: based on Panchangam derived above
- label: infinity icon (fontawesome) followed by the word YOGA
  value: "current yoga"
  requirements: based on Panchangam derived above
- label: scale-balanced icon (fontawesome) followed by the word KARANA
  value: current karana
  requirements: based on Panchangam derived above
- label: icon based on requirements followed by the word RITU
  value: current ritu
  requirements:
    - based on Panchangam derived above. icon requirements below
      - Vasanta should be icon seedling (fontawesome)
      - Grishma should be icon emoji-sunglasses-fill (bootstrap icons)
      - Varsha should be icon cloud-bolt (fontawesome)
      - Sharada should be icon leaf (fontawesome)
      - Hemanta should be icon wind (fontawesome)
      - Shishira should be icon snowflake (fontawesome)
```

## Sankalpam

Specification for the `Sankalpam` page.

- Derive the Panchangam by using the `computePanchangam` method for the current moment with the `latitude` and `longitude` if stored in localstorage.

### Title

- The title has the word `Sankalpam` and is centered
- `font-family` should be `Samarkan`
- uses the `primary` color
- has `font-size` of `4rem`
- `letter-spacing` of `0em`

### Sankalpam Text

Based on the computed panchangam generate the Sankalpam based on the template below:

- Replace the variables between {{ }} with the corresponding attribute from the Panchangam object.
- uses the `accent` color
- has `font-size` of `1.5rem`
- `letter-spacing` of `0.025em`
- ensure that the interpolated variables `{{ }}` are bold with `font-size` of `1.75` rem
- give the background a parchment like feel that envelopes the text and has a padding of `4rem`

```
{{ namasamvatsare }} Namasamvatsare, {{ ayane }}, {{ ritau }} Ritau, {{ mase }} Mase, {{ pakshe }} Pakshe, {{ tithi }} Tithau, {{ vara }} Vasare, {{ nakshatra }} Nakshatre, {{ yoga }} Yoge, {{ karana }} Karane
```

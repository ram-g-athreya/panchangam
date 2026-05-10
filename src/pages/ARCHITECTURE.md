# ARCHITECTURE.md

All pages have the header component on top and the navigation sidebar initially hidden.

## DailyView

Specification for the `DailyView` page.

- Derive the Panchangam by using the `computePanchangam` method for the current moment with the `latitude` and `longitude` if stored in localstorage.
- Padding should be `1rem`

### Panchang for Today

This panel gives the basic Panchang information for today.

- In desktop it should span about 1/3 width, in tablets half width and in mobile full width
- Background color for the panel should be the secondary background color
- Information is presented as cards where information is grouped based on the context

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
    - width should be for entire row
    - label should be split into 3 sections followed by a toggle switch
    - toggle switch with the text saying 12-hour or 24-hour in the background and being 12-hour by default.
    - Based on the value chosen the value below needs to change to 12-hour or 24-hour format
    - Store the value in localStorage and rehydrate on startup
    - Ensure that the storage key is in the constants file and imported
    - First section is Clock icon (fontawesome) followed by TIME
    - Second section is sunrise-fill icon (bootstrap icons) followed by the word SUNRISE
    - Third sections is sunset-fill icon (bootstrap icons) followed by the word SUNSET
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
    - If the value is undefined then set a placeholder text that user should set their city
# - label: sunrise-fill icon (bootstrap icons) followed by the word SUNRISE
#   value: Sunrise time only
#   subvalue: ""
#   requirements: based on Panchangam derived above and should change based on the 12-hour, 24-hour toggle.
# - label: sunset-fill icon (bootstrap icons) followed by the word SUNSET
#   value: Sunset time only
#   subvalue: ""
#   requirements: based on Panchangam derived above and should change based on the 12-hour, 24-hour toggle. If the value is undefined then set a placeholder text that user should set their city
- label: calendar icon (fontawesome) followed by VARA - MASA - SAMVATSARA
  value: current vara - current masa - current samvatsara
  requirements: the width of the card should span the whole row regardless of form factor
- label: moon icon (fontawesome) followed by the word TITHI
  value: "current tithi"
  subvalue: "current paksha along with number"
  requirements: based on Panchangam derived above
- label: sun icon (fontawesome) followed by the word VARA
  value: "current vara"
  subvalue: ""
  requirements: based on Panchangam derived above
- label: star icon (fontawesome) followed by the word NAKSHATRA
  value: "current nakshatra"
  subvalue: ""
  requirements: based on Panchangam derived above
- label: infinity icon (fontawesome) followed by the word YOGA
  value: "current yoga"
  subvalue: ""
  requirements: based on Panchangam derived above
- label: scale-balanced icon (fontawesome) followed by the word KARANA
  value: current karana
  subvalue: ""
  requirements: based on Panchangam derived above
- label: icon based on requirements followed by the word RITU
  value: current ritu
  subvalue: ""
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

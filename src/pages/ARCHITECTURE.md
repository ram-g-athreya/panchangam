# ARCHITECTURE.md

All pages have the header component on top and footer at the bottom. The footer is not fixed, rather it is only visible when the user scrolls to the bottom of the screen

## DailyView

Specification for the `DailyView` page.

- Derive the Panchangam by using the `computePanchangam` method for the current moment with the `latitude` and `longitude` if stored in localstorage.
- Padding should be `1rem`
- Background color for all panels should be the secondary background color

### Panchang for Today

This panel gives the basic Panchang information for today.

- Its width should span 33.333% in desktop, 50% in tablets and 100% in mobile
- Information is presented as cards where information is grouped based on the context

#### Information Cards

- Displays information cards of the same size with a label, value and sub
- The cards must be responsive and the panel should not exceed the width of the page
- The cards shouldn't exceed 50% width of the panel unless otherwise specified
- Background color should be the tertiary background color
- All icons should be of font-size `1rem`.
- Labels should be of font-size `1rem` and `bold`.
- Padding for each card should be `0.75rem`
- Card should have a minimum width of `165px`
- The card should wrap to the next row if the width overflows outside the panel
- The icons used can be from fontawesome or bootstrap icons
- Bootstrap icons should have a font-size of `1.5rem`
- Gap between cards should be `1rem`

```yaml
- label:
    - Clock icon (fontawesome) followed by TIME
    - width should be 50% if desktop and tablet and 100% in mobile
  value: Current time
  subvalue: current date in the format
  requirements:
    - the TIME value should update every second
    - all values should change based on the 12-hour, 24-hour toggle
    - time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
    - time in 24-hour format of `hh:mm:ss` if 24 hour format is set
- label: the word TITHI
  value: current tithi
  subvalue: current paksha along with number
  requirements:
    - based on Panchangam derived above
    - left side should display the image of the lunar phase by using the corresponding image based on `src/assets/images/${tithi.number}_${tithi.paksha}.webp`
    - the right side should have the label, value and subvalue
    - the width of the card should span 50% in desktop and tablet and 100% in mobile
- label:
    - width should be entire row
    - label should be split into 2 sections
    - First section is sunrise-fill icon (bootstrap icons) followed by the word SUNRISE
    - Second sections is sunset-fill icon (bootstrap icons) followed by the word SUNSET
  requirements:
    - all values should change based on the 12-hour, 24-hour toggle
    - time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
    - time in 24-hour format of `hh:mm:ss` if 24 hour format is set
    - If the value is undefined then set a placeholder text that user should set their city
    - Center the text
- label: star icon (fontawesome) followed by the word NAKSHATRA
  value: iterate over nakshatras and display the name
  subvalue: `upto endTime` if it exists for the item
  requirements:
    - based on Panchangam derived above
    - width should be 50% in desktop and tablet and 100% in mobile
- label: infinity icon (fontawesome) followed by the word YOGA. Ensure that the text is closer to value and has adequate gap with the next value below.
  value: iterate over yogas and display the name
  subvalue: `upto endTime` if it exists for the item. Ensure that the text is closer to value and has adequate gap with the next value below.
  requirements:
    - based on Panchangam derived above
    - width should be 50% in desktop and tablet and 100% in mobile
- label: scale-balanced icon (fontawesome) followed by the word KARANA
  value: iterate over karanas and display the name
  subvalue: `upto endTime` if it exists for the item
  requirements:
    - based on Panchangam derived above.
    - Ensure that the text is closer to value and has adequate gap with the next value below.
    - width should be 50% in desktop and tablet and 100% in mobile
- label: icon based on requirements followed by the word RITU
  value: current ritu
  requirements:
    - based on Panchangam derived above.
    - icon requirements below:
      - Vasanta should be icon seedling (fontawesome)
      - Grishma should be icon emoji-sunglasses-fill (bootstrap icons)
      - Varsha should be icon cloud-bolt (fontawesome)
      - Sharada should be icon leaf (fontawesome)
      - Hemanta should be icon wind (fontawesome)
      - Shishira should be icon snowflake (fontawesome)
    - width should be 50% in desktop and tablet and 100% in mobile
- label: calendar icon (fontawesome) followed by VARA - MASA - SAMVATSARA
  value: current vara - current masa - current samvatsara
  requirements:
    - the width of the card should be 100%
    - Center the text
    - `font-size` of the value text should be `1rem`
- label:
    - width should be entire row
    - label should be split into 2 sections each of 50% width
    - First section is sun icon (fontawesome) followed by the word SUN RASHI
    - Second sections is moon icon (fontawesome) followed by the word MOON RASHI
  value:
    - First section should have the corresponding zodiac icon followed by the Sun Rashi
    - Second section should have the corresponding zodiac icon followed by the Sun Rashi
  subvalue:
    - the corresponding english name with first letter capitalized
  requirements:
    - all values should change based on the 12-hour, 24-hour toggle
    - time in 12-hour format of `hh:mm:ss AM / PM` if 12 hour format is set
    - time in 24-hour format of `hh:mm:ss` if 24 hour format is set
    - If the value is undefined then set a placeholder text that user should set their city
    - Zodiac Icon mappings (all are fontawesome otherwise specified within brackets):
      - Meṣa: aries
      - Vṛṣabha: taurus
      - Mithuna: gemini
      - Karka: cancer
      - Siṃha: leo
      - Kanyā: virgo
      - Tulā: libra
      - Vṛścika: scorpio
      - Dhanu: sagittarius
      - Makara: capricorn
      - Kumbha: aquarius
      - Mīna: pisces
    - Center the text
- label:
    - width should be entire row
    - label should be split into 2 sections each of 50% width
    - First section is snake icon (`public/icons/snake.svg`) followed by the word RAHU KALAM
    - Second sections is bull horns icon (`public/icons/bull-horns.svg`) followed by the word YAMA GANDAM
  value: corresponding Rahu Kalam and Yama Gandam range
  requirements:
    - render the icons as SVG with colors same as the text
    - value font-size should be 1 rem
```

### Sankalpam and Find Star Birthday Widgets

This panel displays the Sankalpam and the user can find their star birthday.

- Its width should span 33.333% in desktop, 50% in tablets and 100% in mobile
- The height of the panel should be same as the panchang panel to be uniform

#### Sankalpam

- Background for this section should be tertiary color
- padding of `1rem`

##### Title

- The title has the word `Sankalpam`
- Center the text
- Use `samarkan` font
- Has `font-size` of `2rem`

##### Sankalpam Text

Based on the computed panchangam generate the Sankalpam based on the template below:

- Replace the variables between {{ }} with the corresponding attribute from the Panchangam object.
- uses the `accent` color
- has `font-size` of `1.15rem`
- `letter-spacing` of `0.025em`
- ensure that the interpolated variables `{{ }}` are bold with `font-size` of `1.25` rem

```
{{ namasamvatsare }} Namasamvatsare, {{ ayane }}, {{ ritau }} Ritau, {{ mase }} Mase, {{ pakshe }} Pakshe, {{ tithi }} Tithau, {{ vara }} Vasare, {{ nakshatra }} Nakshatre, {{ yoga }} Yoge, {{ karana }} Karane
```

#### Find Your Star Birthday

- Background for this section should be tertiary color
- Should have the title **Find My Star Birthday**. Add a gap of at least `0.5rem` between the title and subsequent components.
- **Name**: Name of the user
- **Birth Date & Time**: Date Picker that asks for the user's birth date and time
- **Birth City**: City Search component that user can use to enter their birth city
- **Current City**: City Search component which should have the same value as the component in the header and from `localStorage`. Updating the city here should also update it globally
- **Find Star Birthday** button. The button should be disabled until all the fields are filled
  - Center the button
  - The text should be prefixed by a `star` icon from FontAwesome
  - When the button is clicked then
    - change the color of the background and text to indicate that the button was pressed
    - invoke the `computeStarBirthday` function with birthDate (with time), birth and current lat and long
  - Display the birth star and the star birthday based on the result of the compuation
    - Should have secondary background color
  - save the name, birth date & time and birth city and repopulate on startup if it exists. Store as a single JSON object
  - Store as an array with maximum of 5 times most recently used first. Update entries based on the name
  - Display the stored data as pills with text as the name and a `x` button in the end. Clicking on a pill prepopulates the corresponding data. Clicking on the `x` deletes the data from localStorage
  - The pills are to be displayed below the title and above the text fields
- background color should be tertiary

# ARCHITECTURE.md

Specification for reusable components are defined here

## City Search Text Box

Create a city search text box with the following spec as a separate standalone comoponent:

- Placeholder is `Enter city for accuracy`
- Has the `location-dot` icon to the left
- When focused clear the textbox so user can type a city of their choice
- When the user types more than two characters
  - call `photon koomot API` with the query and additional parameters `osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&limit=7`,
  - show a list of options from which the user can choose their city.
- the options should only have `name,state,country`
- Display a loading indicator towards the right of the search bar when suggestions are being fetched and hide it when results are recieved
- The suggestions list should be the same width as the search bar
- When user selects a city from the autocomplete list, close the list and store the following information in localStorage as an object:
  - city
  - country
  - latitude
  - longitude
- The text displayed in the text box should be `city, country`
- If the user didn't select any option and the textbox gets blurred because the user clicked outside, for example, then populate the stored value if it exists or leave it blank
- When the app is reloaded pre-populate the location and display the city if the data exists or else it should be blank
- have no gap between the location pin and the text
- set `height` as `2rem`
- set `font-size` as `1rem`
- set `minimum-width` as `25rem`

## Settings

- Settings icon which when clicked produces a list of toggles in a callout
- The toggles are as follows:
  - Time
  - Theme
- Add a separator between toggles
- Cicking again on the setting icon or clicking outside or pressing the `esc` key closes the callout
- When the callout is open highlight the icon by making it bold

### Time Toggle Switch

- Has the label `Time` followed by toggle switch with the text saying 12-hour or 24-hour in the background and being 12-hour by default.
- Based on the value chosen the value below needs to change to 12-hour or 24-hour format
- Store the value in localStorage and rehydrate on startup
- Ensure that the storage key is in the constants file and imported

### Theme Toggle Switch

- Has the label `Theme` followed by toggle switch
- the toggle switch should be a slider, ie, the slider should physically move between states with `light` being the default and on the left side and the `dark` being the right side
- Use `font-awesome` icons through the npm library to implement the icons.
- the light icon should use the solid sun icon
- the dark icon should use the solid moon icon
- the background of the toggle should change to the appropriate light or dark background depending on the current state
- store the current toggle value in `localStorage` and re-hydrate it from storage when the app is reloaded. If there is no value present in `localStorage` then set the value as `light` by default
- In the background display the text `Light` or `Dark` depending on the current theme. The text should be `0.75rem` and set the `left` or `right` offset to `0.75rem` depending on the case

## Header

- The top panel has a padding of `1rem 0.5rem`
- Has a button with the hamburger bars navigation icon followed by the `Panchangam` text.
- The right side has the `City Search Text Box` on larger screens and in smaller screens push the text box below the `Panchangam` text and have it span the entire row
- The rightmost corner of the header should have the settings icon in all screents

### Panchangam Text

- The header has the word `Panchangam` on the left corner
- uses the `accent` color
- has `font-size` of `2rem`
- `letter-spacing` of `0em`
- clicking on the text should re-direct the user to the homepage `/`

## Navigation Sidebar

- The navigation sidebar is closed by default
- opens out as an overlay when the hamburger icon is clicked
- contains navigation links at the top
- theme toggle switch at the bottom
- When open, clicking anywhere outside should close the sidebar
- Implement a smooth sliding transition of `0.5s` for opening and closing the sidebar

### Navigation Links

The links are as follows:

- **Home**: maps to `/` and has the home icon
- **Sankalpam**: maps to `/sankalpam` and has the hands praying NOT person praying

Styling should be as follows:

- Set the background color as the tertiary background color
- Depending upon the current page or if user hovers a link,
  - Change the background to secondary background color
  - Make the text `bold`

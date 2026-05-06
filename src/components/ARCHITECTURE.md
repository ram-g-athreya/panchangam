# ARCHITECTURE.md

Specification for reusable components are defined here

## City Search Text Box

Create a city search text box with the following spec as a separate standalone comoponent:

- Placeholder is `Enter City Name`
- Has the `location-dot` icon to the left
- Upon losing focus the location value is stored in localStorage as an object:
  - city
  - latitude
  - longitude
- When the app is reloaded pre-populate the location and display the city if the data exists or else it should be blank

## Header

- The top panel has a padding of `1rem 0.5rem`
- Has a button with the hamburger bars navigation icon followed by the `Panchangam` text.
- The right side has the `City Search Text Box` towards the end

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
- Depending upon the current page, change the background of the corresponding link to secondary background so that user knows which page they are currently in.

#### Theme Toggle Switch

- A toggle switch is on the right corner to toggle between light and dark themes
- the toggle switch should be a slider, ie, the slider should physically move between states with `light` being the default and on the left side and the `dark` being the right side
- Use `font-awesome` icons through the npm library to implement the icons.
- the light icon should use the solid sun icon
- the dark icon should use the solid moon icon
- the background of the toggle should change to the appropriate light or dark background depending on the current state
- store the current toggle value in `localStorage` and re-hydrate it from storage when the app is reloaded. If there is no value present in `localStorage` then set the value as `light` by default
- In the background display the text `Light` or `Dark` depending on the current theme. The text should be `0.75rem` and set the `left` or `right` offset to `0.75rem` depending on the case

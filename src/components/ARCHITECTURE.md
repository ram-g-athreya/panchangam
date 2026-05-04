# ARCHITECTURE.md

Specification for reusable components are defined here

## Header

The header component has a padding of `1rem`

### Panchangam Text

- The header has the word `Panchangam` on the left corner
- uses the `accent` color
- has `font-size` of `2.5rem`
- `letter-spacing` of `0em`

### Theme Toggle Switch

- A toggle switch is on the right corner to toggle between light and dark themes
- the toggle switch should be a slider, ie, the slider should physically move between states with `light` being the default and on the left side and the `dark` being the right side
- Use `font-awesome` icons through the npm library to implement the icons.
- the light icon should use the solid sun icon
- the dark icon should use the solid moon icon
- the background of the toggle should change to the appropriate light or dark background depending on the current state
- store the current toggle value in `localStorage` and re-hydrate it from storage when the app is reloaded. If there is no value present in `localStorage` then set the value as `light` by default
- In the background display the text `Light` or `Dark` depending on the current theme. The text should be `0.75rem` and set the `left` or `right` offset to `0.75rem` depending on the case

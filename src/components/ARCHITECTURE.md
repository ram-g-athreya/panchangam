# ARCHITECTURE.md

Specification for reusable components are defined here

## Header

### Layout

- The header has the word `Panchangam` on the left corner
- A toggle switch is on the right corner to toggle between light and dark themes

### Styling

The header component has a padding of `1rem`

The word `Panchangam` has the following styling

- uses the `accent` color
- has `font-size` of `2.5rem`
- `letter-spacing` of `0em`

The toggle switch to change theme has the following styling
Use `font-awesome` icons through the npm library to implement the icons.

- the light icon should use <FontAwesomeIcon icon={byPrefixAndName.fas['sun']} />
- the dark icon should use <FontAwesomeIcon icon={byPrefixAndName.fas['moon']} />
- the background of the toggle should change to the appropriate light or dark background

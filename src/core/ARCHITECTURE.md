# ARICHITECTURE.md

## Panchangam

- Create a Panchangam interface that has the following attributes as per the Vedic calendar
  - **tithi**: lunar day which is an object with the `name`, `paksha` of type `Shukla` or `Krishna` and `number` signifying the number of day of the paksha
  - **vara**: solar weekday
  - **nakshatra**: associated star
  - **yoga**: represents the combined angular relationship between the Sun and the Moon
  - **karana**: half of the tithi
  - **namasamvatsare**: year in the vedic calendar
  - **ayane**: the solstice
  - **ritau**: the season
  - **mase**: the vedic month
- Write corresponding functions to calculate each component
- Expose a function called `computePanchangam` that takes a date as parameter and returns the Panchangam

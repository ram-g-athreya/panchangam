# ARCHITECTURE.md

## Panchangam

- Create a Panchangam interface that has the following attributes as per the Vedic calendar:
  - **tithi**: lunar day object with `name`, `paksha` (`Shukla` or `Krishna`), and `number` signifying the day of the paksha.
  - **vara**: solar weekday (Calculated from Sunrise to Sunrise).
  - **nakshatras**: Array of nakshatras for the day. First nakshatra should have the endTime when the nakshatra ends. If the endTime is within the day then also include then also include the next nakshatra. Nakshatra is the associated lunar mansion (star) for the day.
  - **yogas**: Array of nakshatras for the day. First nakshatra should have the endTime when the nakshatra ends. If the endTime is within the day then also include then also include the next nakshatra. Yoga is the combined angular relationship between the Sun and the Moon.
  - **karanas**: Array of both karanas for the day. First karana should have the endTime when the karana ends. It signifies half of the tithi.
  - **samvatsara**: year name in the 60-year Jovian cycle.
  - **ayana**: the solstice (Uttarayana or Dakshinayana).
  - **ritu**: the season.
  - **masa**: the vedic month.
  - **sunRashi**: the Sun Rashi
  - **moonRashi**: the Moon Rashi
  - **sunRise**: Date and time of Sunrise
  - **sunSet**: Date and time of Sunset

- Write corresponding functions to calculate each component.
- Expose a function called `computePanchangam` that takes the following as parameters:
  - `date`
  - `latitude`
  - `longitude`
  - `lunarSystem` (values can be `amanta` or `purnimantha`)
  - `useSunrise` (default being `true`)
- returns the corresponding Panchangam

### Algorithm

#### 1. Technical Implementation Requirements

- **Precision:** Use double-precision floating-point numbers for all astronomical coordinates.
- **Trigonometry:** All math functions (Sine, Cosine, Tangent) must receive input in **Radians**.
  - _Formula:_ `radians = degrees * (pi / 180)`
- **Normalization:** All angular results must be normalized to the range `[0, 360)`.
  - _Formula:_ `((angle % 360) + 360) % 360`
- **Time Standard:** Use **Julian Day (JD)** derived from UTC for all planetary positions.
- **Sunrise Definition**: Use a **Zenith of 90.8333** degrees (90 degrees 50 minutes) to account for the Sun's upper limb and atmospheric refraction.
- **Logic Flow:**
  1. Calculate the **Local Sunrise** (in UTC) for the given Date and coordinates. Use Latitude and Longitude if valid values are provided. Do NOT use a `DEFAULT_LATITUDE` and `DEFAULT_LONGITUDE`.
  2. Use a **Zenith of 90.8333°** ($90^\circ 50'$) to account for the Sun's upper limb and atmospheric refraction.
  3. Convert this **Sunrise UTC Time** into a precise **Julian Day (JD)**.
  4. Calculate all planetary positions (Sun/Moon longitudes) for that specific **Sunrise Julian Day**.
  5. Determine the "ruling" Panchangam elements based on these sunrise positions.

#### 2. Core Astronomical Principles

- **Coordinate System:** All calculations must be performed using **Nirayana (Sidereal)** longitudes.
- **Ayanamsha (Chitrapaksha/Lahiri):** To convert Tropical (Sayana) longitudes to Sidereal, use the high-precision Lahiri formula
- **Nirayana Longitude Formula:** `L_sidereal = (L_tropical - A) % 360`

#### 3. High-Precision Planetary Positions

Planetary longitudes must be calculated for the Julian Century (T) from the J2000.0 epoch: `T = (JD - 2451545.0) / 36525.0`

#### A. Moon Longitude (Luni-Solar Perturbations)

Use the `sweph-wasm` library to calculate the sidereal moon longitude based on the Julian Day with the flags `SEFLG_SWIEPH` and `SEFLG_SIDEREAL`

#### B. Sun Longitude

Use the `sweph-wasm` library to calculate the sidereal sun longitude based on the Julian Day with the flags `SEFLG_SWIEPH` and `SEFLG_SIDEREAL`

#### 4. Element Definitions & Algorithms

##### A. Tithi (Lunar Day)

Tithi is defined by the angular separation (elongation) between the Moon and the Sun.

- **Formula:** `E = (L_moon_sidereal - L_sun_sidereal) % 360`
- **Logic:** One Tithi equals `12` degrees of elongation.
- **Data Structure:**
  - `number`: `( floor(E / 12) % 15 ) + 1`
  - `paksha`: "Shukla" if `floor(E / 12) < 15`, otherwise "Krishna".
  - `name`: Map the number to the Sanskrit name. If the total index is 14, name is "Purnima"; if 29, name is "Amavasya".

##### B. Vara (Solar Weekday)

The Vara corresponds to the physical day.

- **Logic:** Standard 7-day cycle.
- **Mapping:** 0=Ravivara, 1=Somavara, 2=Mangalavara, 3=Budhavara, 4=Guruvara, 5=Shukravara, 6=Shanivara.

##### C. Nakshatra (Lunar Mansion)

The Nakshatra is determined by the Moon's specific position in the sidereal zodiac.

- **Logic:** Divide the `360` degree circle into 27 equal segments of `13.3333` degrees.
- **Index:** `floor(L_moon_sidereal / 13.3333)`

##### D. Yoga (Luni-Solar Angular Relationship)

Yoga is determined by the combined sidereal longitudes of the Sun and the Moon.

- **Formula:** `S = (L_sun_sidereal + L_moon_sidereal) % 360`
- **Index:** `floor(S / 13.3333)` (Total of 27 Yogas).

##### E. Karana (Half-Tithi)

A Karana is half of a Tithi, representing `6` degrees of elongation.

- **Logic:** There are 60 Karanas in a lunar month.
  - **Fixed Karanas:** 1. `Kimstughna`: Index 0 (1st half of 1st Tithi). 2. `Shakuni`: Index 57 (2nd half of 29th Tithi). 3. `Chatushpada`: Index 58 (1st half of 30th Tithi). 4. `Naga`: Index 59 (2nd half of 30th Tithi).
  - **Repeating Karanas:** Indices 1 through 56 cycle through a specific 7-name set (Bava, Balava, Kaulava, Taitila, Garaja, Vanija, Vishti) eight times.

##### F. Mase (Vedic Month)

- **Sun's position at the last New Moon (S_nm)**: `sunSidereal - elongation * 0.0808`
- **Rashi at New Moon (R_nm)**: `floor(S_nm / 30)`
- **Mase Index (M)**: `(R_nm + 1) % 12`
- If user chooses `purnimanta` then `M = (M + 1) % 12`

##### G. Ritau (Season)

The six Vedic seasons are defined by the Sun's sidereal progression.

- **Logic:** Each season consists of two months (`60` degrees of solar longitude).
- **Index:** `floor(L_sun_sidereal / 60)` (0=Vasanta, 1=Grishma, 2=Varsha, 3=Sharada, 4=Hemanta, 5=Shishira).

##### H. Ayane (Solstice)

Refers to the Sun's declination trend (Northward or Southward).

- **Logic:** \* `Uttarayana`: Sun is in the arc from Sidereal Capricorn (`270` degrees) to Gemini (`90` degrees).
  - `Dakshinayana`: Sun is in the arc from Sidereal Cancer (`90` degrees) to Sagittarius (`270` degrees).

##### I. Samvatsare (Year Name)

The name of the year in the 60-year Jovian cycle.

- **Jupiter's Mean Longitude (L_j)**: `34.3964407 + 3034.9056746 * T + 0.00010547 * T * T`
- **Samvatsara Elapsed (S_elapsed)**:
  - One Samvatsara = Jupiter traversing 1 Rashi (30°).
  - One 60-year cycle = 5 full revolutions of Jupiter (1800° total).
  - 11.9 is the offset to align this astronomical motion with the J2000 epoch
  - **Formula**: `L_j / 30 + 11.9`
- **Samvatsara Index**: `floor(S_elapsed % 60)`

##### J. Sun Sign (Sun Rashi)

- **Sun Rashi Index**: `floor(sunSidereal % 30)`

##### K. Moon Sign (Moon Rashi)

- **Moon Rashi Index**: `floor(moonSidereal % 30)`

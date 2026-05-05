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

### Algorithm

#### 1. Core Astronomical Principles

- **Coordinate System:** All calculations must be performed using **Nirayana (Sidereal)** longitudes.
- **Ayanamsha (Precession Adjustment):** To convert Tropical (Sayana) longitudes to Sidereal, the **Lahiri Ayanamsha** must be subtracted.
  - _Calculation:_ `A = 23.85 + 1.396 * T + 0.000308 * T^2`
  - _Where:_ `T` is the Julian centuries from the J2000.0 epoch.
- **Nirayana Longitude Formula:** `L_sidereal = (L_tropical - A) % 360`
- **Time Standard:** Calculations should utilize **Julian Day (JD)** derived from UTC to maintain astronomical precision and avoid time-zone offsets during calculation.

#### 2. Element Definitions & Algorithms

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

Determined by the Sun's presence in a specific Sidereal Rashi (Zodiac sign).

- **Logic:** Each month spans `30` degrees of solar sidereal longitude.
- **Index:** `floor(L_sun_sidereal / 30)` (0=Chaitra, 1=Vaishakha, etc.).

##### G. Ritau (Season)

The six Vedic seasons are defined by the Sun's sidereal progression.

- **Logic:** Each season consists of two months (`60` degrees of solar longitude).
- **Index:** `floor(L_sun_sidereal / 60)` (0=Vasanta, 1=Grishma, 2=Varsha, 3=Sharada, 4=Hemanta, 5=Shishira).

##### H. Ayane (Solstice)

Refers to the Sun's declination trend (Northward or Southward).

- **Logic:** \* `Uttarayana`: Sun is in the arc from Sidereal Capricorn (`270` degrees) to Gemini (`90` degrees).
  - `Dakshinayana`: Sun is in the arc from Sidereal Cancer (`90` degrees) to Sagittarius (`270` degrees).

##### I. Namasamvatsare (Year Name)

The name of the year in the 60-year Jovian cycle.

- **Logic:** Calculated by adding an offset to the current Shaka or Vikram Samvat year.
- **Formula:** `(Year_current + Offset) % 60` mapped to the Samvatsara list.

#### 3. Mathematical Constraints

1.  **Normalization:** All angular results must be constrained to `[0, 360)` using a floating-point modulo.
2.  **Trigonometry:** All astronomical functions (Sine, Cosine) must receive input in Radians (`degrees * pi / 180`).
3.  **Precision:** Calculations for Sun and Moon longitudes must use the full perturbation terms provided by the Jean Meeus algorithms for accuracy.

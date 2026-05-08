# ARCHITECTURE.md

## Panchangam

- Create a Panchangam interface that has the following attributes as per the Vedic calendar:
  - **tithi**: lunar day object with `name`, `paksha` (`Shukla` or `Krishna`), and `number` signifying the day of the paksha.
  - **vara**: solar weekday (Calculated from Sunrise to Sunrise).
  - **nakshatra**: associated lunar mansion (star).
  - **yoga**: combined angular relationship between the Sun and the Moon.
  - **karana**: half of the tithi.
  - **namasamvatsare**: year name in the 60-year Jovian cycle.
  - **ayane**: the solstice (Uttarayana or Dakshinayana).
  - **ritau**: the season.
  - **mase**: the vedic month.
  - **sunSidereal**: sidereal sun longitude
  - **moonSidereal**: sidereal moon longitude
- Write corresponding functions to calculate each component.
- Expose a function called `computePanchangam` that takes `date`, `latitude`, and `longitude` as parameters and returns the Panchangam calculated at the **exact moment of local sunrise**.

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

#### A. Ayanamsha (Chitrapaksha/Lahiri)

**Ayanamsha (Chitrapaksha/Lahiri)**: To match high-precision calendars, use the True Ayanamsha.

- **Mean Ayanamsha (A_m)**: `23.857092 + 1.396971 * T + 0.0003086 * T * T;`
- **Omega (omega)**: `125.04452 - 1934.136261 * T`
- **Mean Longitude of Sun (LP)**: `280.4665 + 36000.7698 * T`
- **Mean Longitude of Moon (L)**: `218.3165 + 481267.8813 * T`
- **Nutation (N)**:

```
(-17.1996 * sin(omega) -
      1.3187 * sin(2 * L) -
      0.2274 * sin(2 * LP) +
      0.2062 * sin(2 * omega)) / 3600
```

- **Ayanamsha (A)**: `A_m + N`

#### B. Moon Longitude (Luni-Solar Perturbations)

Calculate the Fundamental Arguments in degrees:

- **Mean Longitude (L_m)**: `218.3164477 + (481267.8812307 * T)`
- **Mean Elongation (D)**: `297.8501921 + (445267.1114034 * T)`
- **Sun's Mean Anomaly (M)**: `357.5291092 + (35999.0502909 * T)`
- **Moon's Mean Anomaly (M')**: `134.9633964 + (477198.8675055 * T)`
- **Moon's Argument of Latitude (F)**: `93.2720950 + (483202.0175233 * T)`
- **Eccentricity of Earth's Orbit (E)**: `1 - 0.002516 * T - 0.0000074 * T * T`

**Periodic Correction (L_corr)**:
Major Periodic Terms (The "L" series in Meeus Table 47.A). These correct for Evection, Variation, and Annual Equation

```
L_corr =
  6288774 * sin(M') +
  1274027 * sin(2 * D - M') +
  658314 * sin(2 * D) +
  213618 * sin(2 * M') -
  185116 * E * sin(M) - // Solar influence
  114332 * sin(2 * F) +
  58793 * sin(2 * D - 2 * M') +
  57066 * E * sin(2 * D - M - M') +
  53322 * sin(2 * D + M') +
  45758 * E * sin(2 * D - M) -
  40923 * E * sin(M' - M) -
  34720 * sin(D) -
  30383 * E * sin(M + M') +
  15327 * sin(2 * D - 2 * F) // Added term for inclination/node
```

**Final Sidereal Moon**: `L_moon_sidereal = (L' + L_corr / 1000000 - A) % 360`

#### C. Sun Longitude

- **Mean Longitude (L0)**: `280.46646 + 36000.76983 * T + 0.0003032 * T * T`
- **Mean Anomaly (M)**: `357.5291092 + 35999.0502909 * T - 0.0001537 * T * T`
- **Equation of Center (C)**:

```
C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M);
```

- **Aberration (Ab)**: `0.00569`
- **Lahiri Ayanamsa (A)**: Use the `Lahiri Ayanamsa` function specified earlier.
- **Final Sidereal Sun**: `L_sun_sidereal = (L0 + C - A - Ab) % 360`.

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

## 5. Refined Implementation Rules

### A. Temporal Anchoring (The Sunrise Rule)

- **Constraint:** All Panchangam elements (including `vara` and `namasamvatsare`) MUST be calculated based on the conditions at the `sunriseDate`.
- **Logic:** If the input `date` is `2024-05-20T02:00:00Z` (2:00 AM) and local sunrise is at `05:45 AM`, the `computePanchangam` function must return the attributes for the _previous_ solar day.
- **Variable Alignment:** Derive `vara` using `sunriseDate.getUTCDay()`.

### B. Mathematical Constants & Precision

- **Lunar Mansion Width:** Use exactly `(360 / 27)` instead of `13.3333` to prevent cumulative rounding errors in Nakshatra and Yoga indices.
- **Tithi Definition:** - `Purnima` (Full Moon) is exactly `tithiIndex 14`.
  - `Amavasya` (New Moon) is exactly `tithiIndex 29`.
- **Normalization:** Apply the `((angle % 360) + 360) % 360` formula to every intermediate sum/difference of longitudes (e.g., Elongation, Yoga Sum).

### C. Samvatsara (60-Year Cycle) Logic

- Use the **North Indian / Shaka-based** Jovian cycle calculation:
  - `Shaka_Year = Gregorian_Year - 78` (Adjust by -1 if the date is before Chaitra Shukla Pratipada).
  - `Index = (Shaka_Year + 12) % 60`.
- Map the index to the `SAMVATSARAS` constant array.

### D. Karana Sequence Logic

- Use a strictly conditional map for the four **Sthira** (Fixed) Karanas:
  1. `Kimstughna`: 1st half of 1st Tithi (Index 0).
  2. `Shakuni`: 2nd half of 29th Tithi (Index 57).
  3. `Chatushpada`: 1st half of 30th Tithi (Index 58).
  4. `Naga`: 2nd half of 30th Tithi (Index 59).
- All other indices (`1` through `56`) follow: `REPEATING_KARANAS[(index - 1) % 7]`.

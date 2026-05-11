# ARCHITECTURE.md

## Panchangam.ts

Test specifications for `src/core/panchangam.ts`.

### Unit tests for the computePanchangam function

Add test cases

```yaml
description:
  - Allow an error of `1 minute` for `sunRise` or `sunSet`
  - Keep all these error margins as constants at the top of the file and use them in the test
test_cases:
  - parameters:
      date: Fri May 08 2026 18:34:10 GMT-0400 (Eastern Daylight Time)
      latitude: 39.0437192
      longitude: -77.4874899
    expected_output:
      - tithi: Saptami
      - vara: Shukravara
      - nakshatras:
          - name: Uttara Ashadha
          - name: Shravana
      - yogas:
          - name: Shubha
          - name: Shukla
      - karanas:
          - name: Vishti
          - name: Bava
      - samvatsara: Parabhava
      - ayana: Uttarayana
      - ritu: Vasanta
      - masa: Vaishakha
      - sunRise: Fri May 08 2026 06:04:00 GMT-0400 (Eastern Daylight Time)
      - sunSet: Thu May 07 2026 20:10:00 GMT-0400 (Eastern Daylight Time)
```

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
      lunar_system: amanta
    expected_output:
      tithi: Saptamī
      vara: Śukravāra
      nakshatras:
        - name: Uttara Aṣāḍhā
          endTime: Fri May 08 2026 11:50:00 GMT-0400 (Eastern Daylight Time)
        - name: Śravaṇa
      yogas:
        - name: Śubha
          endTime: Fri May 08 2026 17:00:00 GMT-0400 (Eastern Daylight Time)
        - name: Śukla
      karanas:
        - name: Viṣṭi
          endTime: Fri May 08 2026 15:46:00 GMT-0400 (Eastern Daylight Time)
        - name: Bava
      samvatsara: Parābhava
      ayana: Uttarayana
      ritu: Vasanta
      masa: Vaiśākha
      sunRashi: Meṣa
      moonRashi: Makara
      sunRise: Fri May 08 2026 06:04:00 GMT-0400 (Eastern Daylight Time)
      sunSet: Fri May 08 2026 20:10:00 GMT-0400 (Eastern Daylight Time)
      rahuKalam:
        start: 2026-05-08T15:21:25.500Z
        end: 2026-05-08T17:07:11.000Z
      yamaKandam:
        start: 2026-05-08T20:38:42.000Z
        end: 2026-05-08T22:24:27.500Z
      meta:
        sunSidereal: 23.60701389062405
        moonSidereal: 277.08847648783467
        elongation: 253.48146259721057
  - parameters:
      date: Fri May 08 2026 18:34:10 GMT-0400 (Eastern Daylight Time)
      latitude: 39.0437192
      longitude: -77.4874899
      lunar_system: purnimanta
    expected_output:
      tithi:
        name: Saptamī
        number: 7
        paksha:
      vara: Śukravāra
      nakshatras:
        - name: Uttara Aṣāḍhā
          endTime: Fri May 08 2026 11:50:00 GMT-0400 (Eastern Daylight Time)
        - name: Śravaṇa
      yogas:
        - name: Śubha
          endTime: Fri May 08 2026 17:00:00 GMT-0400 (Eastern Daylight Time)
        - name: Śukla
      karanas:
        - name: Viṣṭi
          endTime: Fri May 08 2026 15:46:00 GMT-0400 (Eastern Daylight Time)
        - name: Bava
      samvatsara: Parābhava
      ayana: Uttarayana
      ritu: Vasanta
      masa: Jyeṣṭha
      sunRashi: Meṣa
      moonRashi: Makara
      sunRise: Fri May 08 2026 06:04:00 GMT-0400 (Eastern Daylight Time)
      sunSet: Fri May 08 2026 20:10:00 GMT-0400 (Eastern Daylight Time)
      rahuKalam:
        start: 2026-05-08T15:21:25.500Z
        end: 2026-05-08T17:07:11.000Z
      yamaKandam:
        start: 2026-05-08T20:38:42.000Z
        end: 2026-05-08T22:24:27.500Z
      meta:
        sunSidereal: 23.60701389062405
        moonSidereal: 277.08847648783467
        elongation: 253.48146259721057
```

### Unit tests for the computeStarBirthday function

Add test cases

```yaml
description:
  - Allow an error of `1 minute` for `sunRise` or `sunSet`
  - Keep all these error margins as constants at the top of the file and use them in the test
  - Compare the date string and they should be exactly equal
test_cases:
  - parameters:
      currentDate: Sun May 17 2026 01:33:00 GMT-0400 (Eastern Daylight Time)
      birthDate: 1990-06-05T01:20
      birthLatitude: 10.7860267
      birthLongitude: 79.1381497
      currentLatitude: 39.0437192
      currentLongitude: -77.4874899
    expected_output:
      birthNakshatra: Svātī
      starBirthday: Thu May 28 2026 00:00:00 GMT-0400 (Eastern Daylight Time)
  - parameters:
      currentDate: Sun May 17 2026 01:33:00 GMT-0400 (Eastern Daylight Time)
      birthDate: 1990-10-06T07:20
      birthLatitude: 10.7860267
      birthLongitude: 79.1381497
      currentLatitude: 39.0437192
      currentLongitude: -77.4874899
    expected_output:
      birthNakshatra: Aśvinī
      starBirthday: Thu May 26 2026 00:00:00 GMT-0400 (Eastern Daylight Time)
```

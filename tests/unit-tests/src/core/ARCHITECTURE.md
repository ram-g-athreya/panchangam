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
      - tithi: Saptamī
      - vara: Śukravāra
      - nakshatras:
          - name: Uttarāṣāḍhā
            endTime: Fri May 08 2026 11:50:00 GMT-0400 (Eastern Daylight Time)
          - name: Śravaṇa
      - yogas:
          - name: Śubha
            endTime: Fri May 08 2026 17:00:00 GMT-0400 (Eastern Daylight Time)
          - name: Śukla
      - karanas:
          - name: Viṣṭi
            endTime: Fri May 08 2026 15:46:00 GMT-0400 (Eastern Daylight Time)
          - name: Bava
      - samvatsara: Parābhava
      - ayana: Uttarayana
      - ritu: Vasanta
      - masa: Vaiśākha
      - sunRashi: Meṣa
      - moonRashi: Makara
      - sunRise: Fri May 08 2026 06:04:00 GMT-0400 (Eastern Daylight Time)
      - sunSet: Thu May 07 2026 20:10:00 GMT-0400 (Eastern Daylight Time)
  - parameters:
      date: Fri May 08 2026 18:34:10 GMT-0400 (Eastern Daylight Time)
      latitude: 39.0437192
      longitude: -77.4874899
      lunar_system: purnimanta
    expected_output:
      - tithi:
          name: Saptamī
          number: 7
          paksha:
      - vara: Śukravāra
      - nakshatras:
          - name: Uttarāṣāḍhā
            endTime: Fri May 08 2026 11:50:00 GMT-0400 (Eastern Daylight Time)
          - name: Śravaṇa
      - yogas:
          - name: Śubha
            endTime: Fri May 08 2026 17:00:00 GMT-0400 (Eastern Daylight Time)
          - name: Śukla
      - karanas:
          - name: Viṣṭi
            endTime: Fri May 08 2026 15:46:00 GMT-0400 (Eastern Daylight Time)
          - name: Bava
      - samvatsara: Parābhava
      - ayana: Uttarayana
      - ritu: Vasanta
      - masa: Jyeṣṭha
      - sunRashi: Meṣa
      - moonRashi: Makara
      - sunRise: Fri May 08 2026 06:04:00 GMT-0400 (Eastern Daylight Time)
      - sunSet: Thu May 07 2026 20:10:00 GMT-0400 (Eastern Daylight Time)
```

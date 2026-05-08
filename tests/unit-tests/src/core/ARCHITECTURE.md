# ARCHITECTURE.md

## Panchangam.ts

Test specifications for `src/core/panchangam.ts`.

### Unit tests for the computePanchangam function

Add test cases

```yaml
description:
  - Allow an error of `0.02` for `siderealSunLongitude`
  - Allow an error of `0.06` for `siderealMoonLongitude`
test_cases:
  - parameters:
      date: Fri May 08 2026 18:34:10 GMT-0400 (Eastern Daylight Time)
      latitude: 39.0437192
      longitude: -77.4874899
    expected_output:
      - sunSidereal: 24.10
      - moonSidereal: 283.41
```

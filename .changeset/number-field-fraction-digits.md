---
'@keystatic/core': patch
---

Fix `fields.number` rounding values to 3 decimal places when the input is blurred (e.g. `51.98771` was saved as `51.988`)

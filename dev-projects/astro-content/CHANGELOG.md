# astro-content

## 0.0.20

### Patch Changes

- Updated dependencies [[`86bd966`](https://github.com/Thinkmill/keystatic/commit/86bd966ff35981185030ce0850b8041e8a2dc5bb), [`dc7e028`](https://github.com/Thinkmill/keystatic/commit/dc7e0287b1cd1e6b4d09e3b39d390054b60fe130)]:
  - @keystatic/core@0.5.18
  - @keystatic/astro@5.0.0

## 0.0.19

### Patch Changes

- Updated dependencies [[`42975f4`](https://github.com/Thinkmill/keystatic/commit/42975f45ba071cf3e2659a67e75e86325ce84944), [`8c2abff`](https://github.com/Thinkmill/keystatic/commit/8c2abff7fe38ad3e1687de57f9bc550997619761)]:
  - @keystatic/core@0.5.17
  - @keystatic/astro@5.0.0

## 0.0.18

### Patch Changes

- Updated dependencies [[`21394c6`](https://github.com/Thinkmill/keystatic/commit/21394c65a8d507d4355cf71641690464c05d7ec8)]:
  - @keystatic/core@0.5.16
  - @keystatic/astro@5.0.0

## 0.0.17

### Patch Changes

- Updated dependencies [[`d3aa1f2`](https://github.com/Thinkmill/keystatic/commit/d3aa1f2386bd690936662d98724eb385564a26cd), [`aa13ea9`](https://github.com/Thinkmill/keystatic/commit/aa13ea917ce2611266c0008197cfea4c1427724c)]:
  - @keystatic/core@0.5.15
  - @keystatic/astro@5.0.0

## 0.0.16

### Patch Changes

- Updated dependencies [[`fe63e6a`](https://github.com/Thinkmill/keystatic/commit/fe63e6a77a695d7cafb5aadb12a7eb2e1c914f0b), [`adc0cf6`](https://github.com/Thinkmill/keystatic/commit/adc0cf6282494eb522f6d129a49a7dd9c25c9490), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2)]:
  - @keystatic/core@0.5.14
  - @keystatic/astro@5.0.0

## 0.0.15

### Patch Changes

- Updated dependencies [[`b509e87`](https://github.com/Thinkmill/keystatic/commit/b509e8794b8e4676feb6e1f0982ddb80cc5376df), [`31286c0`](https://github.com/Thinkmill/keystatic/commit/31286c0e3ff0bd591853fdab70f7f797dad316f5)]:
  - @keystatic/core@0.5.13
  - @keystatic/astro@5.0.0

## 0.0.14

### Patch Changes

- Updated dependencies [a2d56566]
- Updated dependencies [603d85be]
- Updated dependencies [d37a5422]
- Updated dependencies [2c818862]
- Updated dependencies [5f11dcd2]
- Updated dependencies [d860d675]
- Updated dependencies [319c0dba]
- Updated dependencies [ce1696f6]
- Updated dependencies [a703043c]
- Updated dependencies [d20e1ad6]
- Updated dependencies [e819d5f2]
  - @keystatic/core@0.5.12
  - @keystatic/astro@5.0.0

## 0.0.13

### Patch Changes

- Updated dependencies [dbb9d3cb]
  - @keystatic/core@0.5.11
  - @keystatic/astro@5.0.0

## 0.0.12

### Patch Changes

- Updated dependencies [e1ebbdae]
  - @keystatic/core@0.5.10
  - @keystatic/astro@5.0.0

## 0.0.11

### Patch Changes

- Updated dependencies [847b9163]
  - @keystatic/core@0.5.9
  - @keystatic/astro@5.0.0

## 0.0.10

### Patch Changes

- Updated dependencies [4d1cee00]
  - @keystatic/core@0.5.8
  - @keystatic/astro@5.0.0

## 0.0.9

### Patch Changes

- Updated dependencies [c519f119]
  - @keystatic/core@0.5.7
  - @keystatic/astro@5.0.0

## 0.0.8

### Patch Changes

- Updated dependencies [c619ef2e]
  - @keystatic/core@0.5.6
  - @keystatic/astro@5.0.0

## 0.0.7

### Patch Changes

- Updated dependencies [8ad803c5]
  - @keystatic/core@0.5.0
  - @keystatic/astro@5.0.0

## 0.0.6

### Patch Changes

- 6a60ab3c: Updates the Astro integration to manage the custom `127.0.0.1` host and enables usage with `output: 'server'`

  Keystatic used to require updating your `dev` script. It's now managed by the integration, feel free to simplify it!

  ```diff
  - "dev": "astro dev --host 127.0.0.1"
  + "dev": "astro dev"
  ```

  Moreover, Keystatic now lets you go full SSR! The following Astro config is now supported

  ```mjs
  // astro.config.mjs

  export default defineConfig({
    output: 'server',
  });
  ```

- Updated dependencies [6a60ab3c]
- Updated dependencies [e3947052]
- Updated dependencies [ee3f2038]
  - @keystatic/astro@4.0.0
  - @keystatic/core@0.4.0

## 0.0.5

### Patch Changes

- Updated dependencies [0b2432ed]
- Updated dependencies [f4aaa8e3]
  - @keystatic/core@0.3.0
  - @keystatic/astro@3.0.0

## 0.0.4

### Patch Changes

- Updated dependencies [b768f147]
- Updated dependencies [32d22480]
  - @keystatic/astro@2.0.0
  - @keystatic/core@0.2.0

## 0.0.3

### Patch Changes

- Updated dependencies [03f0543c]
- Updated dependencies [c24dc631]
- Updated dependencies [6895c566]
- Updated dependencies [7310a672]
- Updated dependencies [c5407cce]
- Updated dependencies [ca6774b8]
- Updated dependencies [1f96ff27]
- Updated dependencies [03f0543c]
- Updated dependencies [7767c69a]
  - @keystatic/core@0.1.0
  - @keystatic/astro@1.0.0

## 0.0.2

### Patch Changes

- Updated dependencies [5c86514f]
- Updated dependencies [c43d7045]
- Updated dependencies [21395048]
  - @keystatic/astro@0.0.9
  - @keystatic/core@0.0.116

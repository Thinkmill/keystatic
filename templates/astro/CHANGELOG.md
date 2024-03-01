# @keystatic/templates-astro

## 0.0.17

### Patch Changes

- Updated dependencies [8ad803c5]
  - @keystatic/core@0.5.0
  - @keystatic/astro@5.0.0

## 0.0.16

### Patch Changes

- 6a60ab3c: Updates the Astro integration to manage the custom `127.0.0.1` host
  and enables usage with `output: 'server'`

  Keystatic used to require updating your `dev` script. It's now managed by the
  integration, feel free to simplify it!

  ```diff
  - "dev": "astro dev --host 127.0.0.1"
  + "dev": "astro dev"
  ```

  Moreover, Keystatic now lets you go full SSR! The following Astro config is
  now supported

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

## 0.0.15

### Patch Changes

- Updated dependencies [0b2432ed]
- Updated dependencies [f4aaa8e3]
  - @keystatic/core@0.3.0
  - @keystatic/astro@3.0.0

## 0.0.14

### Patch Changes

- d584b3f0: Support astro@4
- Updated dependencies [13206393]
- Updated dependencies [0ca7f47a]
- Updated dependencies [7a98fd68]
- Updated dependencies [56b6b121]
- Updated dependencies [3288c624]
- Updated dependencies [bd28cfd4]
- Updated dependencies [e32ff596]
- Updated dependencies [d584b3f0]
- Updated dependencies [16bd7064]
- Updated dependencies [e1c9e0cf]
- Updated dependencies [267845b1]
  - @keystatic/core@0.2.5
  - @keystatic/astro@2.0.1

## 0.0.13

### Patch Changes

- Updated dependencies [b768f147]
- Updated dependencies [32d22480]
  - @keystatic/astro@2.0.0
  - @keystatic/core@0.2.0

## 0.0.12

### Patch Changes

- b16ef684: Replace manually created pages for Keystatic with Astro integration
  that injects routes

## 0.0.11

### Patch Changes

- f47feaa7: Add support for Astro assets with image directory and publicPath in
  Keystatic config
- Updated dependencies [a754d573]
- Updated dependencies [e684e5ad]
  - @keystatic/astro@1.0.2

## 0.0.10

### Patch Changes

- 36cb6803: Upgrading template to Astro v3
- Updated dependencies [36cb6803]
  - @keystatic/astro@1.0.1

## 0.0.9

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

## 0.0.8

### Patch Changes

- 2127a105: Add --host flag to astro dev command + version updates
- Updated dependencies [5c86514f]
- Updated dependencies [c43d7045]
- Updated dependencies [21395048]
  - @keystatic/astro@0.0.9
  - @keystatic/core@0.0.116

## 0.0.7

### Patch Changes

- 14c8d90b: Update to @astrojs/markdoc version that fixes a known bug
- Updated dependencies [ad46c9dd]
- Updated dependencies [47102969]
  - @keystatic/core@0.0.115

## 0.0.6

### Patch Changes

- Updated dependencies [6b4c476c]
- Updated dependencies [f9f09616]
  - @keystatic/core@0.0.114

## 0.0.5

### Patch Changes

- Updated dependencies [07c63bab]
- Updated dependencies [062ccf49]
  - @keystatic/core@0.0.113

## 0.0.4

### Patch Changes

- Updated dependencies [efc83c9c]
  - @keystatic/core@0.0.112

## 0.0.3

### Patch Changes

- Updated dependencies [bf6a27bb]
  - @keystatic/core@0.0.111

## 0.0.2

### Patch Changes

- Updated dependencies [e667fb9c]
- Updated dependencies [aec6359b]
- Updated dependencies [e0c4c37e]
- Updated dependencies [781884f9]
- Updated dependencies [cafe3695]
  - @keystatic/core@0.0.110

## 0.0.1

### Patch Changes

- 4fc2c61e: New Astro Keystatic CLI option + template
- Updated dependencies [4e595627]
- Updated dependencies [477b4e96]
- Updated dependencies [b832e495]
- Updated dependencies [b6f4fb12]
- Updated dependencies [68e3be7c]
  - @keystatic/core@0.0.109

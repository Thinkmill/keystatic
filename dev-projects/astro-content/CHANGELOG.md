# astro-content

## 0.0.6

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

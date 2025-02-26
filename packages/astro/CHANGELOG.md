# @keystatic/astro

## 5.0.6

### Patch Changes

- [#1414](https://github.com/Thinkmill/keystatic/pull/1414) [`0ae5599`](https://github.com/Thinkmill/keystatic/commit/0ae55994ce9867788eb92fe9d493b2658e23bd28) Thanks [@emmatown](https://github.com/emmatown)! - Fix build output when used with TypeScript's `"moduleResolution": "nodenext"` option

- Updated dependencies [[`0ae5599`](https://github.com/Thinkmill/keystatic/commit/0ae55994ce9867788eb92fe9d493b2658e23bd28)]:
  - @keystatic/core@0.5.46

## 5.0.5

### Patch Changes

- [#1404](https://github.com/Thinkmill/keystatic/pull/1404) [`e848667`](https://github.com/Thinkmill/keystatic/commit/e848667c8b3b46357b2b62d401e8be252b68e1aa) Thanks [@emmatown](https://github.com/emmatown)! - Allow React 19 in peerDependencies

- Updated dependencies [[`9a73371`](https://github.com/Thinkmill/keystatic/commit/9a73371c642da0770536076cb7f4e70a0fe496f6), [`c300a68`](https://github.com/Thinkmill/keystatic/commit/c300a68253a3ea95662aae19fdae880727da899a), [`4c4b0ef`](https://github.com/Thinkmill/keystatic/commit/4c4b0efa8ecfc45053dee992f7ceb8566c520ede), [`e848667`](https://github.com/Thinkmill/keystatic/commit/e848667c8b3b46357b2b62d401e8be252b68e1aa)]:
  - @keystatic/core@0.5.44

## 5.0.4

### Patch Changes

- [#1367](https://github.com/Thinkmill/keystatic/pull/1367) [`a361b0a`](https://github.com/Thinkmill/keystatic/commit/a361b0a551b62e08c25c2506103643046fb7b631) Thanks [@emmatown](https://github.com/emmatown)! - Add npm publishing provenance

- Updated dependencies [[`f006f08`](https://github.com/Thinkmill/keystatic/commit/f006f08f0a112fa56e5fc4e9ae4d9010c2220453), [`1a23c5b`](https://github.com/Thinkmill/keystatic/commit/1a23c5bd3b6595bfa4bf4c4e554717111e6e3a12), [`a361b0a`](https://github.com/Thinkmill/keystatic/commit/a361b0a551b62e08c25c2506103643046fb7b631), [`7a89c00`](https://github.com/Thinkmill/keystatic/commit/7a89c0079fac1a17396d58d9495b9492bb405678)]:
  - @keystatic/core@0.5.43

## 5.0.3

### Patch Changes

- [#1340](https://github.com/Thinkmill/keystatic/pull/1340) [`92fc874`](https://github.com/Thinkmill/keystatic/commit/92fc8747d6fc4dcb48461517754725d16df4b1f6) Thanks [@emmatown](https://github.com/emmatown)! - Support `@astrojs/cloudflare@10.0.0` and above

- Updated dependencies [[`dccad1a`](https://github.com/Thinkmill/keystatic/commit/dccad1ac9913a7d31415150cb12e4f80b192c5a5)]:
  - @keystatic/core@0.5.39

## 5.0.2

### Patch Changes

- [#1329](https://github.com/Thinkmill/keystatic/pull/1329) [`f005ab2`](https://github.com/Thinkmill/keystatic/commit/f005ab223888df1d7187759e72bfd0303027b1ff) Thanks [@emmatown](https://github.com/emmatown)! - Remove check for `output: 'hybrid'` or `output: 'server'` to support Astro 5

- Updated dependencies [[`c8d3865`](https://github.com/Thinkmill/keystatic/commit/c8d3865154a35253cfa552abf30b0da497fb1059)]:
  - @keystatic/core@0.5.38

## 5.0.1

### Patch Changes

- [#1326](https://github.com/Thinkmill/keystatic/pull/1326) [`6d7fae2`](https://github.com/Thinkmill/keystatic/commit/6d7fae2c51a3ecd5b543993f145fda1dbea8f0f0) Thanks [@fsmeier](https://github.com/fsmeier)! - Remove unused `cookie` dependency

- Updated dependencies [[`6d7fae2`](https://github.com/Thinkmill/keystatic/commit/6d7fae2c51a3ecd5b543993f145fda1dbea8f0f0)]:
  - @keystatic/core@0.5.37

## 5.0.0

### Patch Changes

- Updated dependencies [8ad803c5]
  - @keystatic/core@0.5.0

## 4.0.0

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

- Updated dependencies [e3947052]
- Updated dependencies [ee3f2038]
  - @keystatic/core@0.4.0

## 3.0.2

### Patch Changes

- 3e4f6f4c: Fix build errors
- Updated dependencies [8320c683]
  - @keystatic/core@0.3.4

## 3.0.1

### Patch Changes

- 17ef271b: Fix `internal` files not being published
- Updated dependencies [1b6200a2]
  - @keystatic/core@0.3.3

## 3.0.0

### Major Changes

- f4aaa8e3: Switch build to ESM-only

### Patch Changes

- Updated dependencies [0b2432ed]
- Updated dependencies [f4aaa8e3]
  - @keystatic/core@0.3.0

## 2.0.3

### Patch Changes

- 42089ab2: Fix build error

## 2.0.2

### Patch Changes

- d76af081: Fix default exports in Node ESM
- Updated dependencies [d76af081]
  - @keystatic/core@0.2.6

## 2.0.1

### Patch Changes

- d584b3f0: Support astro@4
- Updated dependencies [13206393]
- Updated dependencies [0ca7f47a]
- Updated dependencies [7a98fd68]
- Updated dependencies [56b6b121]
- Updated dependencies [3288c624]
- Updated dependencies [bd28cfd4]
- Updated dependencies [e32ff596]
- Updated dependencies [16bd7064]
- Updated dependencies [e1c9e0cf]
- Updated dependencies [267845b1]
  - @keystatic/core@0.2.5

## 2.0.0

### Major Changes

- b768f147: Update router integration between `@keystatic/core` and framework integration packages to improve performance

### Patch Changes

- Updated dependencies [b768f147]
- Updated dependencies [32d22480]
  - @keystatic/core@0.2.0

## 1.0.2

### Patch Changes

- a754d573: Fix `@keystatic/astro/api` CommonJS output
- e684e5ad: Fix `@keystatic/astro` integration

## 1.0.1

### Patch Changes

- 36cb6803: Allow `astro@3` in `peerDependencies`

## 1.0.0

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

## 0.0.9

### Patch Changes

- 5c86514f: Change Astro integration to require hybrid mode
- Updated dependencies [c43d7045]
- Updated dependencies [21395048]
  - @keystatic/core@0.0.116

## 0.0.8

### Patch Changes

- 618ba4aa: Remove `url`/`KEYSTATIC_URL` config option
- Updated dependencies [618ba4aa]
- Updated dependencies [30298e81]
  - @keystatic/core@0.0.106

## 0.0.7

### Patch Changes

- aeac610: Updated generated TypeScript declaration
- Updated dependencies [aeac610]
  - @keystatic/core@0.0.78

## 0.0.6

### Patch Changes

- 1ea62fe: Add `repository` key to keystatic/core package.json
- Updated dependencies [02a0fd1]
- Updated dependencies [02a0fd1]
- Updated dependencies [6890696]
- Updated dependencies [1ea62fe]
  - @keystatic/core@0.0.66

## 0.0.5

### Patch Changes

- 5b7dbce: Use `import.meta.env` in API route handler.
- Updated dependencies [e2230c0]
  - @keystatic/core@0.0.49

## 0.0.4

### Patch Changes

- c38e0fb: Fix `internal` directory not being published

## 0.0.3

### Patch Changes

- a569bdb: Add Astro integration
- Updated dependencies [a569bdb]
  - @keystatic/core@0.0.42

## 0.0.2

### Patch Changes

- 18167ee: Fix bad params parsing when there are query params

## 0.0.1

### Patch Changes

- 9bcf3d4: Astro support
- Updated dependencies [9bcf3d4]
  - @keystatic/core@0.0.40

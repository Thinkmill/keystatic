---
'@keystatic/core': minor
---

Updated to `@keystar/ui@0.8.0`, `react-aria@3.50.0` and `react-stately@3.48.0`. The versions of these are now pinned to exact versions and are declared as standard dependencies as well as optional peer dependencies. If you have explicit dependencies on `@keystar/ui`, `react-aria` or `react-stately`, you should ensure you have the same versions installed otherwise you will get a peer dependency error/warning. In future, `@keystatic/core` may bump these packages in patch versions so you should likely pin `@keystatic/core` to an exact version if you depend on these packages yourself.

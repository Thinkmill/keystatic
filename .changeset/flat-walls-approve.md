---
'@keystar/ui': minor
---

Updated to `react-aria@3.50.0` and `react-stately@3.48.0`. The versions of these are now pinned to exact versions and are declared as standard dependencies as well as optional peer dependencies. If you have explicit dependencies on `react-aria` or `react-stately`, you should ensure you have the same versions installed otherwise you will get a peer dependency error/warning. In future, `@keystar/ui` may bump these packages in patch versions so you should likely pin `@keystar/ui` to an exact version if you depend on these packages yourself.
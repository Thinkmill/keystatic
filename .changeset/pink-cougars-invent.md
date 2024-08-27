---
'@keystar/ui': patch
---

Misc. fixes and updates.

Fixes:

- Allow "focus" method on `Picker` ref
- Defensive "current" selector on `NavItem` styles
- Fix text truncation on `Picker` selected text
- Clear slots of `Content` children—resolves issue with `Calendar` elements within `Dialog` receiving incorrect props
- Fix issue with `Tray` when "size" provided to `Dialog` component

Updates:

- Support "isPending" prop on `Button`
- Support "low" prominence `Checkbox`
- Emphasise "selected" state on `ActionButton`
- More prominent `ActionBar`
- Increase `TextArea` min-height to 3 lines
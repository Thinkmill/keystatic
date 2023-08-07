# Keystar UI Primitives

Typography, sizing, and color primitives for the Keystar design system.

## Ideas & observations

### Size scale

The size scale abstraction doesn't add value, just use pixel values for names
(even if they're converted to REMs):

```diff
- '200': {
-   $value: '16px',
-   $type: 'dimension',
- }
+ '16': {
+   $value: '16px',
+   $type: 'dimension',
+ }
```

### Spacing

T-shirt sizes for spacing is weird… For style-props probably just use the scale
and assume good intentions. There's cases where semantic tokens make sense but
it'll take a while to set up, things like:

- the padding around button content
- the gap between a control and its label
- the padding around dialog content
- the gap between breadcrumbs and delimeters

### Heading t-shirt sizes

Using t-shirt sizes for headings is wrong. We should describe headings, or maybe
just all text variants, by some semantic name e.g. "caption" and apply all the
parts that make that font e.g.

```json
"color": "{some.value}",
"fontFamily": "{some.value}",
"fontSize": "{some.value}",
"fontWeight": "{some.value}",
"lineHeight": "{some.value}",
"textTransform": "{some.value}",
```

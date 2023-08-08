# Keystar UI Primitives

Typography, sizing, and color primitives for the Keystar design system.

## Roadmap

Some things are working well while others are a bit wonky. For the next little
while it's fine to copy/paste stuff and massage as needed, this is already much
better than the current setup. In the future i'd like to improve and automate
where possible.

- validate tokens [zod](https://zod.dev/)
- preview tokens [storybook](https://storybook.js.org/)
- workflows [github actions](https://docs.github.com/en/actions)
  - validate changes
  - a11y check (contrast etc.)
  - deploy preview
  - run tests
  - build & publish

## Figma

### Collections

Two collections (for now). In the future we'll probably need a collection for
composite tokens like "border", "shadow" and "typography".

- color (mode:light|dark)
  - scale
  - alias
  - backgrounds
  - foregrounds
  - icon
  - shadow
- size
  - scale
  - border
  - container
  - dialog
  - element
  - icon
  - radius
  - space

### Structure

Figma variables support
["modes"](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)
for things like color scheme, and device size.

The file for the color collection would look like `colors.json`:

```json
{
  "id": "collection-id",
  "name": "colors",
  "modes": {
    "1:0": "Light",
    "1:1": "Dark"
  },
  "variableIds": ["loads-of-ids"],
  "variables": [
    {
      "id": "token-id",
      "name": "alias/backgroundPressed",
      "type": "COLOR",
      "scopes": ["FRAME_FILL", "SHAPE_FILL"],
      "valuesByMode": {
        "1:0": {
          "type": "VARIABLE_ALIAS",
          "id": "id-of-token"
        },
        "1:1": {
          "type": "VARIABLE_ALIAS",
          "id": "id-of-token"
        }
      },
      "resolvedValuesByMode": {
        "1:0": {
          "resolvedValue": {
            "r": 0,
            "g": 0,
            "b": 0,
            "a": 0.114
          },
          "alias": "id-of-token",
          "aliasName": "scales/black"
        },
        "1:1": {
          "resolvedValue": {
            "r": 1,
            "g": 1,
            "b": 1,
            "a": 0.124
          },
          "alias": "id-of-token",
          "aliasName": "scales/white"
        }
      }
    }
  ]
}
```

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

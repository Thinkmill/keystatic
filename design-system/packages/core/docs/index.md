---
title: Core
description: Core functions and components for Voussoir.
category: Introduction
---

## TODO

Needs documentation in general...

## Provider

```jsx {% live=true %}
const [colorScheme, toggleScheme] = React.useReducer(
  s => (s === 'dark' ? 'light' : 'dark'),
  'light'
);

return (
  <VoussoirProvider colorScheme={colorScheme}>
    <Button onPress={toggleScheme} aria-pressed={colorScheme === 'dark'}>
      Dark
    </Button>
    <Text>Test</Text>
  </VoussoirProvider>
);
```

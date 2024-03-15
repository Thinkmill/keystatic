---
title: Core
description: Core functions and components for Keystar UI.
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
  <div>
    <Switch
      isSelected={colorScheme === 'dark'}
      onChange={toggleScheme}
      marginBottom="large"
    >
      Dark mode
    </Switch>
    <KeystarProvider colorScheme={colorScheme}>
      <Grid
        gap="xlarge"
        backgroundColor="canvas"
        padding="large"
        borderTop="muted"
        UNSAFE_style={{
          marginInline: `calc(${tokenSchema.size.space.large} * -1)`,
          marginBottom: `calc(${tokenSchema.size.space.large} * -1)`,
        }}
      >
        <Flex wrap gap="medium" alignItems="end">
          <Picker label="Picker">
            <Item key="first">First</Item>
            <Item key="second">Second</Item>
            <Item key="third">Third</Item>
          </Picker>
          <TextField
            label="Text"
            minWidth="alias.singleLineWidth"
            isRequired
            flex
          />
          <ActionButton>Action</ActionButton>
        </Flex>
        <ButtonGroup>
          <Button prominence="high">Primary</Button>
          <Button prominence="low">Secondary</Button>
        </ButtonGroup>
      </Grid>
    </KeystarProvider>
  </div>
);
```

## Client-side routing

The provider component accepts an optional `router` prop. This enables Keystar
components that render links to perform client side navigation using your
application or framework's client side router.

```jsx
import { KeystarProvider } from '@keystar/ui/core';

function App() {
  let navigate = useNavigateFromYourRouter();

  return <KeystarProvider router={{ navigate }}>{/* ... */}</KeystarProvider>;
}
```

Note that external links to different origins will not trigger client side
routing, and will use native browser navigation. Additionally, if the link has a
[target](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target)
other than `"\_self"`, uses the
[download](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
attribute, or the user presses modifier keys such as `Command` or `Alt` to
change the default behavior, browser native navigation will occur instead of
client side routing.

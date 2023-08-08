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
    <VoussoirProvider colorScheme={colorScheme}>
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
    </VoussoirProvider>
  </div>
);
```

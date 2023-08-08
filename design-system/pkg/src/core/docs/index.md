---
title: Core
description: Core functions and components for Keystar UI.
category: Introduction
---

## TODO

Needs documentation in general...

## Provider

```jsx {% live=true %}
const context = useProvider();
const [colorScheme, toggleScheme] = React.useReducer(
  s => (s === 'dark' ? 'light' : 'dark'),
  context.colorScheme
);

return (
  <div>
    <Switch
      isSelected={colorScheme === 'dark'}
      onChange={toggleScheme}
      marginBottom="medium"
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
        <Heading>Text samples</Heading>
        <Flex wrap gap="medium">
          <Text color="neutralEmphasis">Neutral Emphasis</Text>
          <Text color="neutral">Neutral (default)</Text>
          <Text color="neutralSecondary">Neutral Secondary</Text>
          <Text color="neutralTertiary">Neutral Tertiary</Text>
        </Flex>

        <Flex wrap gap="medium">
          <Text color="highlight">Highlight</Text>
          <Text color="pending">Pending</Text>
          <Text color="accent">Accent</Text>
          <Text color="positive">Positive</Text>
          <Text color="caution">Caution</Text>
          <Text color="critical">Critical</Text>
        </Flex>

        <Heading>Control samples</Heading>
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

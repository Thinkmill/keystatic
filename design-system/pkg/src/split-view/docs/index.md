---
title: SplitView
description:
  A split view is two sections or "panes", including a moveable separator
  between them that allows users to change the relative size of the panes.
category: Layout
---

## Example

Note that the term "primary" does not describe the importance or purpose of
content inside the pane. In this context, primary indicates which pane the user
may resize, while the secondary pane fills the remaining space.

```jsx {% live=true %}
<SplitView minSize={100} maxSize={400} defaultSize={200} height="element.large">
  <SplitPanePrimary>
    <Text>Primary</Text>
  </SplitPanePrimary>
  <SplitPaneSecondary paddingX="regular">
    <Text>Secondary</Text>
  </SplitPaneSecondary>
</SplitView>
```

---
title: Link component
description:
  Manage client-side routing decisions once, for the component library.
category: Navigation
---

## Provider

The `linkComponent` prop allows you to customise the rendering of Keystar UI
links (e.g. [TextLink](/package/link/text-link), [NavItem](/package/nav-list))
across an entire application. This is useful for conditionally rendering React
Router links, handling analytics, etc.

When defining a custom link component, you must use the `makeLinkComponent`
helper function and forward the ref argument. Some link instances need the ref
to function properly.

```jsx
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { VoussoirProvider } from '@keystar/ui/core';
import { makeLinkComponent } from '@keystar/ui/link';

// First create your custom link:
const CustomLink = makeLinkComponent(({ href, ...otherProps }, ref) => {
  if (href[0] === '/') {
    return <ReactRouterLink ref={ref} to={href} {...otherProps} />;
  }

  return <a ref={ref} href={href} {...otherProps} />;
});

// Then pass it to the provider:
export const App = () => (
  <VoussoirProvider linkComponent={CustomLink}>...</VoussoirProvider>
);
```

## Hook

Access the link component via the `useLinkComponent` hook.

```jsx
const Link = useLinkComponent();
```

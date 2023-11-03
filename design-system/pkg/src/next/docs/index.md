---
title: Next.js
description:
  Utilities for integrating Keystar UI with Next.js's `app` directory.
category: Introduction
---

> `@keystar/ui/next` only works with Next.js's `app` directory. It does not work
> with the `pages` directory.

## NextRootProvider

The `NextRootProvider` exported from `@keystar/ui/next` should be rendered as
the `html` element in your root `layout` file to make server rendering styles
work properly. If you need another `KeystarProvider` in your tree, you should
use the normal `KeystarProvider` exported from `@keystar/ui/core`.

## `nextRootScript`

To make sure that the color scheme and scale is correct before the main
client-side JavaScript loads, you should render a script tag that updates the
class names in the head. A default `nextRootScript` export is provided for this.
This only looks at media queries, if you allow the user to change the color
scheme or scale, you should write your own script instead.

## Example

```tsx
// app/layout.tsx
import { NextRootProvider, nextRootScript } from '@keystar/ui/next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function Layout(props: { children: ReactNode }) {
  return (
    <NextRootProvider fontClassName={inter.variable}>
      <head>{nextRootScript}</head>
      <body>{props.children}</body>
    </NextRootProvider>
  );
}
```

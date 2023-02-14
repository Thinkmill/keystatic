---
title: TableView
description:
  Tables are containers for displaying information. They allow users to quickly
  scan, sort, compare, and take action on large amounts of data.
category: Layout
---

## Example

```jsx {% live=true %}
<TableView aria-label="Example table" selectionMode="multiple">
  <TableHeader>
    <Column width="50%">Name</Column>
    <Column>Type</Column>
    <Column align="end">Date added</Column>
  </TableHeader>
  <TableBody>
    <Row>
      <Cell>Dell Computer Monitor</Cell>
      <Cell>Computing</Cell>
      <Cell>7/6/2020</Cell>
    </Row>
    <Row>
      <Cell>iPad Pro 2017 Model</Cell>
      <Cell>Computing</Cell>
      <Cell>7/4/2021</Cell>
    </Row>
    <Row>
      <Cell>Gopro hero 7</Cell>
      <Cell>Media</Cell>
      <Cell>20/11/2010</Cell>
    </Row>
    <Row>
      <Cell>Playstation 4 Limited Edition</Cell>
      <Cell>Console</Cell>
      <Cell>18/1/2016</Cell>
    </Row>
  </TableBody>
</TableView>
```

## Caveat

This component is still in development.

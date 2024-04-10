import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { Key, memo } from 'react';

type HeaderBreadcrumbsProps = {
  /** The breadcrumb items. */
  items: { key: Key; label: string }[];
  /** Called when an item is selected. */
  onAction: (key: Key) => void;
};

export const HeaderBreadcrumbs = memo((props: HeaderBreadcrumbsProps) => {
  return (
    <Breadcrumbs
      flex
      size="medium"
      minWidth="alias.singleLineWidth"
      onAction={props.onAction}
    >
      {props.items.map(item => (
        <Item key={item.key}>{item.label}</Item>
      ))}
    </Breadcrumbs>
  );
});

import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { Key, memo } from 'react';

type HeaderBreadcrumbsProps = {
  /** The breadcrumb items. */
  items: { key: Key; label: string; href?: string }[];
};

export const HeaderBreadcrumbs = memo((props: HeaderBreadcrumbsProps) => (
  <Breadcrumbs flex size="medium" minWidth="alias.singleLineWidth">
    {props.items.map(item => (
      <Item key={item.key} href={item.href}>
        {item.label}
      </Item>
    ))}
  </Breadcrumbs>
));

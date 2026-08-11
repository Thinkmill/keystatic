import { BreadcrumbItem, Breadcrumbs } from '@keystar/ui/breadcrumbs';
import type { Key } from '@react-types/shared';
import { memo } from 'react';

type HeaderBreadcrumbsProps = {
  /** The breadcrumb items. */
  items: { key: Key; label: string; href?: string }[];
};

export const HeaderBreadcrumbs = memo((props: HeaderBreadcrumbsProps) => (
  <Breadcrumbs flex size="medium" minWidth="alias.singleLineWidth">
    {props.items.map(item => (
      <BreadcrumbItem key={item.key} id={item.key} href={item.href}>
        {item.label}
      </BreadcrumbItem>
    ))}
  </Breadcrumbs>
));

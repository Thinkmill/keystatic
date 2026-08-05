import type {
  BreadcrumbProps as AriaBreadcrumbProps,
  BreadcrumbsProps as AriaBreadcrumbsProps,
} from 'react-aria-components/Breadcrumbs';

import type { BaseStyleProps } from '@keystar/ui/style';
import type { TextProps } from '@keystar/ui/typography';

type BreadcrumbSize = NonNullable<TextProps['size']>;

export interface BreadcrumbsProps<T>
  extends Omit<AriaBreadcrumbsProps<T>, 'className' | 'style'>,
    BaseStyleProps {
  size?: BreadcrumbSize;
}

export interface BreadcrumbItemProps
  extends Omit<AriaBreadcrumbProps, 'className' | 'style'>,
    BaseStyleProps {
  href?: string;
  size?: BreadcrumbSize;
}

import type {
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
  TreeSectionProps as AriaTreeSectionProps,
} from 'react-aria-components/Tree';

import type { BaseStyleProps } from '@keystar/ui/style';

export interface NavTreeProps<T>
  extends Omit<AriaTreeProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export interface NavTreeItemProps<T = object>
  extends Omit<AriaTreeItemProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export interface NavTreeSectionProps<T = object>
  extends Omit<AriaTreeSectionProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

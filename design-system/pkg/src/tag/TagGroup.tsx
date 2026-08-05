import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps as AriaTagListProps,
} from 'react-aria-components/TagGroup';
import { type ForwardedRef, type ReactElement, forwardRef } from 'react';

import {
  type BaseStyleProps,
  classNames,
  css,
  useStyleProps,
} from '@keystar/ui/style';

import { gapVar } from './styles';

export interface TagGroupProps
  extends Omit<AriaTagGroupProps, 'className' | 'style'>,
    BaseStyleProps {}

function TagGroupImpl(
  props: TagGroupProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTagGroup
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={styleProps.className}
    />
  );
}

export const TagGroup = forwardRef(TagGroupImpl);

export interface TagListProps<T>
  extends Omit<AriaTagListProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function TagList<T>(
  props: TagListProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTagList
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        css({
          display: 'flex',
          flexWrap: 'wrap',
          margin: `calc(${gapVar} / -2)`,
          minWidth: 0,
        }),
        styleProps.className
      )}
    />
  );
}

const _TagList = forwardRef(TagList) as <T>(
  props: TagListProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _TagList as TagList };

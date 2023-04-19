import { ReactNode } from 'react';

import { BaseStyleProps, useStyleProps } from '@keystar-ui/style';
import { DOMProps } from '@keystar-ui/types';
import { filterDOMProps } from '@keystar-ui/utils';
import { forwardRefWithAs } from '@keystar-ui/utils/ts';

import { useSlotProps } from './context';

type ContentProps = {
  /**
   * The content element(s).
   */
  children: ReactNode;
} & BaseStyleProps &
  DOMProps;

/** A block of content within a container. */
export const Content = forwardRefWithAs<ContentProps, 'section'>(
  (props, ref) => {
    props = useSlotProps(props, 'content');
    let { elementType: Element = 'section', children, ...otherProps } = props;
    let styleProps = useStyleProps(otherProps);

    return (
      <Element {...filterDOMProps(otherProps)} {...styleProps} ref={ref}>
        {children}
      </Element>
    );
  }
);

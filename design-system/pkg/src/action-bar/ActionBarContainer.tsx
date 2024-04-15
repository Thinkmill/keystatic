import { filterDOMProps, useObjectRef } from '@react-aria/utils';
import React, { ForwardRefExoticComponent, ForwardedRef, Ref } from 'react';

import { classNames, css, useStyleProps } from '@keystar/ui/style';

import { actionbarClassList } from './class-list';
import { ActionBarContainerProps } from './types';

function ActionBarContainer(
  props: ActionBarContainerProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  let domRef = useObjectRef(forwardedRef);

  return (
    <div
      {...filterDOMProps(props)}
      {...styleProps}
      ref={domRef}
      className={classNames(
        css({
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',

          [`& > :not(${actionbarClassList.selector('root')})`]: {
            flex: 1,
            minHeight: 0,
          },
        }),
        actionbarClassList.element('container'),
        styleProps.className
      )}
    >
      {props.children}
    </div>
  );
}

/**
 * ActionBarContainer wraps around an ActionBar and a component that supports selection. It handles
 * the ActionBar's position with respect to its linked component.
 */
const _ActionBarContainer: ForwardRefExoticComponent<
  ActionBarContainerProps & { ref?: Ref<HTMLDivElement> }
> = React.forwardRef(ActionBarContainer);
export { _ActionBarContainer as ActionBarContainer };

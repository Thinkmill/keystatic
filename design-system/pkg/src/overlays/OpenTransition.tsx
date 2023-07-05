import { Children, ReactNode } from 'react';
import Transition, { TransitionProps } from 'react-transition-group/Transition';

import { cloneValidElement } from '@keystar/ui/utils';

export type OpenTransitionProps = Omit<TransitionProps, 'children'> & {
  children: ReactNode;
};

export function OpenTransition(props: OpenTransitionProps) {
  const { children } = props;
  return (
    <Transition timeout={{ enter: 0, exit: 320 }} {...props}>
      {state =>
        Children.map(
          children,
          child =>
            cloneValidElement(child, { isOpen: state === 'entered' }) ?? child
        )
      }
    </Transition>
  );
}

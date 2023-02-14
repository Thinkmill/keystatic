import { Children, ReactNode } from 'react';
import Transition, { TransitionProps } from 'react-transition-group/Transition';

import { cloneValidElement } from '@voussoir/utils';

export type OpenTransitionProps = Omit<TransitionProps, 'children'> & {
  children: ReactNode;
};

export function OpenTransition(props: OpenTransitionProps) {
  const { children, in: isOpen } = props;

  // Do not apply any transition in Chromatic.
  if (process.env.CHROMATIC) {
    return (
      <>
        {Children.map(children, child => cloneValidElement(child, { isOpen }))}
      </>
    );
  }

  return (
    <Transition timeout={{ enter: 0, exit: 320 }} {...props}>
      {state =>
        Children.map(children, child =>
          cloneValidElement(child, { isOpen: state === 'entered' })
        )
      }
    </Transition>
  );
}

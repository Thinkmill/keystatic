import { Children, ReactNode } from 'react';
import _Transition, {
  TransitionProps,
} from 'react-transition-group/Transition';

import { cloneValidElement } from '@keystar/ui/utils';

export type OpenTransitionProps = Omit<TransitionProps, 'children'> & {
  children: ReactNode;
};

const Transition: typeof _Transition =
  (_Transition as any).default || _Transition;
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

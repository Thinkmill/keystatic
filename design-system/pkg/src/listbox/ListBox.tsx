import { useListState } from '@react-stately/list';
import { useObjectRef } from '@react-aria/utils';

import { forwardRef, ReactElement, RefObject } from 'react';

import { ListBoxBase, useListBoxLayout } from './ListBoxBase';
import { ListBoxProps } from './types';

function ListBox<T extends object>(
  props: ListBoxProps<T>,
  forwardedRef: RefObject<HTMLDivElement>
) {
  let domRef = useObjectRef(forwardedRef);
  let state = useListState(props);
  let layout = useListBoxLayout();

  return <ListBoxBase {...props} ref={domRef} state={state} layout={layout} />;
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * A list of options that can allow selection of one or more.
 */
const _ListBox: <T>(
  props: ListBoxProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement = forwardRef(ListBox as any) as any;
export { _ListBox as ListBox };

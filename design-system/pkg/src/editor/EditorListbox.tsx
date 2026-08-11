import type { Key } from '@react-types/shared';

import { ListBox, type ListBoxProps } from '@keystar/ui/listbox';

export interface EditorListboxProps<T>
  extends Omit<ListBoxProps<T>, 'onAction'> {
  onAction?: (key: Key) => void;
}

export function EditorListbox<T extends object>(props: EditorListboxProps<T>) {
  let { onAction, ...listBoxProps } = props;
  return (
    <ListBox
      {...listBoxProps}
      disallowEmptySelection
      selectionMode="single"
      onAction={onAction}
    />
  );
}

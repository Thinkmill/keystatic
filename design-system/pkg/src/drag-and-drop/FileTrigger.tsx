import { filterDOMProps, useObjectRef } from '@react-aria/utils';
import { PressResponder } from '@react-aria/interactions';
import React, { ForwardedRef, forwardRef, ReactNode } from 'react';

export type FileTriggerProps = {
  /** Specifies what mime type of files are allowed. */
  acceptedFileTypes?: string[];
  /** Whether multiple files can be selected. */
  allowsMultiple?: boolean;
  /** The children of the component. */
  children?: ReactNode;
  /** Specifies the use of a media capture mechanism to capture the media on the spot. */
  defaultCamera?: 'user' | 'environment';
  /** Handler when a user selects a file. */
  onSelect?: (files: FileList | null) => void;
};

function FileTrigger(
  props: FileTriggerProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  let {
    acceptedFileTypes,
    allowsMultiple,
    children,
    defaultCamera,
    onSelect,
    ...rest
  } = props;
  let inputRef = useObjectRef(ref);
  let domProps = filterDOMProps(rest);

  return (
    <>
      <PressResponder
        onPress={() => {
          if (inputRef.current?.value) {
            // eslint-disable-next-line react-compiler/react-compiler
            inputRef.current.value = '';
          }
          inputRef.current?.click();
        }}
      >
        {children}
      </PressResponder>
      <input
        {...domProps}
        accept={acceptedFileTypes?.toString()}
        capture={defaultCamera}
        multiple={allowsMultiple}
        onChange={e => onSelect?.(e.target.files)}
        ref={inputRef}
        style={{ display: 'none' }}
        type="file"
      />
    </>
  );
}

/**
 * A FileTrigger allows a user to access the file system with any pressable
 * component, or custom components built with usePress.
 */
const _FileTrigger = forwardRef(FileTrigger);
export { _FileTrigger as FileTrigger };

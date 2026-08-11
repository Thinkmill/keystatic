import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
  useContext,
  useRef,
} from 'react';
import { mergeRefs } from 'react-aria/mergeRefs';
import { Element, Editor } from 'slate';

import { Popover, type PopoverProps } from '@keystar/ui/overlays';
import { css, tokenSchema } from '@keystar/ui/style';

import { nodeTypeMatcher } from '../utils';

type BlockPopoverTriggerProps = {
  element: Element;
  children: [ReactElement, ReactElement<BlockPopoverProps>];
};
type BlockPopoverProps = Pick<PopoverProps, 'hideArrow' | 'placement'> & {
  children: ReactElement;
};
type InternalBlockPopoverProps = BlockPopoverProps & {
  isOpen?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
};

const typeMatcher = nodeTypeMatcher(
  'code',
  'component-block',
  'image',
  'layout',
  'link',
  'table',
  'heading'
);

const ActiveBlockPopoverContext = createContext<undefined | Element>(undefined);
export function useActiveBlockPopover() {
  return useContext(ActiveBlockPopoverContext);
}

export function ActiveBlockPopoverProvider(props: {
  children: ReactNode;
  editor: Editor;
}) {
  const nodeWithPopover = Editor.above(props.editor, {
    match: typeMatcher,
  });
  return (
    <ActiveBlockPopoverContext.Provider value={nodeWithPopover?.[0]}>
      {props.children}
    </ActiveBlockPopoverContext.Provider>
  );
}

export function BlockPopoverTrigger({
  children,
  element,
}: BlockPopoverTriggerProps) {
  let [trigger, popover] = children;
  let activePopoverElement = useActiveBlockPopover();
  let triggerRef = useRef<HTMLElement>(null);
  let childRef = (trigger.props as { ref?: Ref<HTMLElement> }).ref;
  let mergedRef = mergeRefs(triggerRef, childRef);

  return (
    <>
      {cloneElement(trigger, { ref: mergedRef } as {})}
      {cloneElement(popover, {
        isOpen: activePopoverElement === element,
        triggerRef,
      } as InternalBlockPopoverProps)}
    </>
  );
}

export function BlockPopover({
  children,
  hideArrow,
  isOpen,
  placement = 'bottom',
  triggerRef,
}: InternalBlockPopoverProps) {
  if (!triggerRef) return null;

  return (
    <Popover
      isOpen={isOpen}
      triggerRef={triggerRef}
      placement={placement}
      hideArrow={hideArrow}
      isNonModal
      shouldFlip={false}
      containerPadding={8}
      UNSAFE_className={css({
        minHeight: tokenSchema.size.element.regular,
        minWidth: tokenSchema.size.element.regular,
        userSelect: 'none',
        zIndex: 1,
      })}
    >
      <div contentEditable={false}>{children}</div>
    </Popover>
  );
}

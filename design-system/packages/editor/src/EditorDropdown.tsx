import * as React from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  autoUpdate,
  FloatingPortal,
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useMergeRefs,
  FloatingFocusManager,
} from '@floating-ui/react';
import { DialogElement } from './EditorPopover';

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

export const EditorMenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ label, disabled, ...props }, ref) => {
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      role="menuitem"
      disabled={disabled}
    >
      {label}
    </button>
  );
});

interface EditorDropdownProps {
  label: string;
  nested?: boolean;
  children?: React.ReactNode;
}

export const EditorDropdown = React.forwardRef<
  HTMLDivElement,
  EditorDropdownProps & React.HTMLProps<HTMLDivElement>
>(({ children, label, ...props }, forwardedRef) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const listItemsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = React.useRef(
    React.Children.map(children, child =>
      React.isValidElement(child) ? child.props.label : null
    ) as Array<string | null>
  );

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();

  const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [offset({ mainAxis: 4 }), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, {
    event: 'mousedown',
    toggle: true,
  });
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, role, dismiss, listNavigation, typeahead]
  );

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    tree.events.on('click', handleTreeClick);

    return () => {
      tree.events.off('click', handleTreeClick);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit('menuopen', { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  const floatingRef = useMergeRefs([refs.setFloating, forwardedRef]);

  return (
    <>
      <button
        ref={refs.setReference}
        data-open={isOpen ? '' : undefined}
        {...getReferenceProps({
          ...props,
          onClick(event) {
            event.stopPropagation();
          },
        })}
      >
        Toggle
      </button>
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} initialFocus={refs.floating}>
            <DialogElement
              ref={floatingRef}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {React.Children.map(
                children,
                (child, index) =>
                  React.isValidElement(child) &&
                  React.cloneElement(
                    child,
                    getItemProps({
                      tabIndex: activeIndex === index ? 0 : -1,
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node;
                      },
                      onClick() {
                        child.props.onClick?.();
                        setIsOpen(false);
                      },
                      onMouseUp() {
                        child.props.onClick?.();
                        setIsOpen(false);
                      },
                    })
                  )
              )}
            </DialogElement>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
});

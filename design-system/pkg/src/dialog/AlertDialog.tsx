import { chain } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useContext,
} from 'react';

import { Button, ButtonGroup } from '@keystar/ui/button';
import { Content } from '@keystar/ui/slots';
import { useStyleProps } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { DialogContext, DialogContextValue } from './context';
import { Dialog } from './Dialog';
import { AlertDialogProps } from './types';

/**
 * AlertDialogs are a specific type of Dialog. They display important
 * information that users need to acknowledge.
 */
export const AlertDialog: ForwardRefExoticComponent<
  AlertDialogProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function AlertDialog(
  props: AlertDialogProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { onClose = () => {} } =
    useContext(DialogContext) || ({} as DialogContextValue);
  let {
    autoFocusButton,
    cancelLabel,
    children,
    isPrimaryActionDisabled,
    isSecondaryActionDisabled,
    onCancel = () => {},
    onPrimaryAction = () => {},
    onSecondaryAction = () => {},
    primaryActionLabel,
    secondaryActionLabel,
    title,
    tone,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);

  return (
    <Dialog
      role="alertdialog"
      ref={forwardedRef}
      size="small"
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
    >
      <Heading>{title}</Heading>
      <Content>
        {isReactText(children) ? <Text>{children}</Text> : children}
      </Content>
      <ButtonGroup align="end">
        {cancelLabel && (
          <Button
            onPress={() => chain(onClose(), onCancel())}
            autoFocus={autoFocusButton === 'cancel'}
            prominence={secondaryActionLabel ? 'low' : undefined}
          >
            {cancelLabel}
          </Button>
        )}
        {secondaryActionLabel && (
          <Button
            onPress={() => chain(onClose(), onSecondaryAction())}
            autoFocus={autoFocusButton === 'secondary'}
            isDisabled={isSecondaryActionDisabled}
          >
            {secondaryActionLabel}
          </Button>
        )}
        <Button
          prominence="high"
          tone={tone}
          onPress={() => chain(onClose(), onPrimaryAction())}
          isDisabled={isPrimaryActionDisabled}
          autoFocus={autoFocusButton === 'primary'}
        >
          {primaryActionLabel}
        </Button>
      </ButtonGroup>
    </Dialog>
  );
});

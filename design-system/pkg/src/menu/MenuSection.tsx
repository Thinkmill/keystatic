import {
  Header,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
} from 'react-aria-components/Menu';
import {
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
} from 'react';

import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

export interface MenuSectionProps<T = object>
  extends Omit<AriaMenuSectionProps<T>, 'className' | 'style'> {}

function MenuSection<T extends object>(
  props: MenuSectionProps<T>,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  return <AriaMenuSection {...props} ref={forwardedRef} />;
}

const _MenuSection = forwardRef(MenuSection) as <T extends object = object>(
  props: MenuSectionProps<T> & { ref?: ForwardedRef<HTMLElement> }
) => ReactElement;
export { _MenuSection as MenuSection };

export function MenuHeader({ children }: { children: ReactNode }) {
  return (
    <Header>
      <Text
        casing="uppercase"
        size="small"
        color="neutralSecondary"
        weight="medium"
        UNSAFE_className={css({
          paddingBlock: tokenSchema.size.space.regular,
          paddingInline: tokenSchema.size.space.medium,
        })}
      >
        {children}
      </Text>
    </Header>
  );
}

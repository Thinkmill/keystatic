import { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@keystar/ui/icon';
import { checkIcon } from '@keystar/ui/icon/icons/checkIcon';
import { ClearSlots, SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

type ListItemProps = {
  children: ReactNode;
  descriptionProps?: HTMLAttributes<HTMLElement>;
  labelProps?: HTMLAttributes<HTMLElement>;
  keyboardShortcutProps?: HTMLAttributes<HTMLElement>;
  isFocused?: boolean;
  isHovered?: boolean;
  isPressed?: boolean;
  isSelected?: boolean;
};

// TODO: the styling is a mess. I need to clean it up.

/** Common list item component for menus and pickers. */
export const ListItem = forwardRefWithAs<ListItemProps, 'div'>(
  function ListItem(props, forwardedRef) {
    let {
      children,
      elementType: ElementType = 'div',
      descriptionProps,
      keyboardShortcutProps,
      labelProps,
      isFocused,
      isHovered,
      isPressed,
      isSelected,
      ...otherProps
    } = props;

    let gridGutter = tokenSchema.size.space.regular;
    let contentGutter = tokenSchema.size.space.medium;

    let focusIndicatorWidth = tokenSchema.size.space.xsmall;
    let gridClassname = css({
      display: 'grid',
      // listboxes (options) have selection indicators at the end, whilst menus have them at the start
      gridTemplateAreas:
        '". icon text . kbd checkmark ." ". icon description . kbd checkmark ."',
      gridTemplateColumns: `${gridGutter} auto 1fr ${contentGutter} auto ${tokenSchema.size.icon.regular} ${gridGutter}`,
      gridTemplateRows: '1fr auto',
      borderRadius: tokenSchema.size.radius.small,
      paddingBlock: tokenSchema.size.space.regular,
    });
    let rootClassname = css({
      cursor: 'default',
      color: tokenSchema.color.alias.foregroundIdle,
      display: 'block',
      outline: 0,
      position: 'relative',
      paddingInline: tokenSchema.size.space.small,

      // indicate when external link? e.g. `&[href^=http]`
      'a&': {
        cursor: 'pointer',
      },

      '& .list-item-text': {
        marginBlock: `calc((${tokenSchema.size.icon.regular} - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
      },

      [`&:not([aria-disabled=true])`]: {
        '& .list-item-checkmark': {
          stroke: tokenSchema.color.alias.foregroundSelected,
        },
        '& .list-item-icon': {
          color: tokenSchema.color.foreground.neutralSecondary,
        },
      },

      // standard menu items: no selection indicator
      [`&[role=menuitem] .${gridClassname}`]: {
        gridTemplateAreas: '". icon text . kbd ." ". icon description . kbd ."',
        gridTemplateColumns: `${gridGutter} auto 1fr ${contentGutter} auto ${gridGutter}`,
      },

      [[
        // selectable menu items: selection indicator at the start
        `&[role=menuitemcheckbox] .${gridClassname}, &[role=menuitemradio] .${gridClassname}`,

        // menus with _any_ selectable items must make space for the selection indicator
        `[data-selection=single] &[role=menuitem] .${gridClassname}, [data-selection=multiple] &[role=menuitem] .${gridClassname}`,
      ].join(', ')]: {
        gridTemplateAreas:
          '". checkmark icon text . kbd ." ". checkmark icon description . kbd ."',
        gridTemplateColumns: `${tokenSchema.size.space.small} ${tokenSchema.size.icon.medium} auto 1fr ${contentGutter} auto ${gridGutter}`,
      },

      // hover
      [`&[aria-disabled=false]:hover .${gridClassname}, &[data-hovered] .${gridClassname}`]:
        {
          backgroundColor: tokenSchema.color.alias.backgroundHovered,
          color: tokenSchema.color.alias.foregroundHovered,
        },

      // focus
      [`&[aria-disabled=false]:focus .${gridClassname}, &[data-focused] .${gridClassname}`]:
        {
          backgroundColor: tokenSchema.color.alias.backgroundHovered,
          color: tokenSchema.color.alias.foregroundHovered,
        },

      // emphasise icons during interaction
      '&[aria-disabled=false]:hover .list-item-icon, &[data-hovered] .list-item-icon, &[aria-disabled=false]:focus .list-item-icon, &[data-focused] .list-item-icon':
        {
          color: tokenSchema.color.alias.foregroundIdle,
        },
      // emphasise `kbd` during interaction
      '&[aria-disabled=false]:hover kbd, &[data-hovered] kbd, &[aria-disabled=false]:focus kbd, &[data-focused] kbd':
        {
          color: tokenSchema.color.alias.foregroundIdle,
        },

      // press
      [`&[aria-disabled=false]:active .${gridClassname}, &[data-pressed] .${gridClassname}`]:
        {
          backgroundColor: tokenSchema.color.alias.backgroundPressed,
          color: tokenSchema.color.alias.foregroundPressed,
        },

      // focus indicator
      '&[data-focused]': {
        // [`& .${gridClassname}`]: {
        //   backgroundColor: tokenSchema.color.alias.backgroundSelected,
        // },
        '&::before': {
          backgroundColor: tokenSchema.color.background.accentEmphasis,
          borderRadius: focusIndicatorWidth,
          content: '""',
          insetBlock: tokenSchema.size.space.xsmall,
          insetInlineStart: 0,
          position: 'absolute',
          width: focusIndicatorWidth,
        },
      },

      // disabled
      '&[aria-disabled=true]': {
        color: tokenSchema.color.alias.foregroundDisabled,
        '& kbd': {
          color: 'currentColor',
        },
        '& .list-item-checkmark': {
          stroke: 'currentColor',
        },
      },
    });

    const slots = {
      text: {
        ...labelProps,
        color: 'inherit',
        gridArea: 'text',
        // weight: 'medium',
        UNSAFE_className: 'list-item-text',
      },
      icon: {
        gridArea: 'icon',
        marginEnd: 'regular',
        UNSAFE_className: 'list-item-icon',
      },
      description: {
        color: 'neutralSecondary',
        gridArea: 'description',
        marginY: 'small',
        size: 'small',
        ...descriptionProps,
      },
      kbd: {
        UNSAFE_className: css({
          alignItems: 'center',
          color: tokenSchema.color.foreground.neutralTertiary,
          display: 'flex',
          gridArea: 'kbd',
          height: tokenSchema.size.icon.regular,
        }),
        ...keyboardShortcutProps,
      },
    } as const;

    return (
      <ElementType
        // NOTE: disabled and selected states should be stored against aria attributes
        {...toDataAttributes({
          focused: isFocused || undefined,
          hovered: isHovered || undefined,
          pressed: isPressed || undefined,
        })}
        {...otherProps}
        ref={forwardedRef}
        className={classNames(rootClassname)}
      >
        <div className={gridClassname}>
          <ClearSlots>
            <SlotProvider slots={slots}>
              {children}
              {isSelected && (
                <Icon
                  src={checkIcon}
                  slot="checkmark"
                  strokeScaling={false}
                  gridArea="checkmark"
                  UNSAFE_className="list-item-checkmark"
                />
              )}
            </SlotProvider>
          </ClearSlots>
        </div>
      </ElementType>
    );
  }
);

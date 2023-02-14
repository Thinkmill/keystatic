import { useId } from '@react-aria/utils';
import { ReactNode } from 'react';

import { Box } from '@voussoir/layout';
import { classNames, css, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';
import { DOMProps } from '@voussoir/types';
import { filterDOMProps } from '@voussoir/utils';

import {
  itemContentGutter,
  listBlockGutter,
  textInsetStart,
} from './constants';

export type NavGroupProps = {
  children: ReactNode;
  title: string;
} & DOMProps;

// TODO:
// - generic `Group` or `Section` slot component
// - collapsible?

/** Render a group of navigation links. */
export function NavGroup(props: NavGroupProps) {
  const { children, id, title, ...otherProps } = props;
  const headingId = useId(id);
  const groupStyles = useGroupStyles();
  const headingStyles = useHeadingStyles();

  return (
    <li className={classNames(groupStyles)} {...filterDOMProps(otherProps)}>
      <Text elementType="h3" id={headingId} UNSAFE_className={headingStyles}>
        {title}
      </Text>
      <Box elementType="ul" flexShrink={0} aria-labelledby={headingId}>
        {children}
      </Box>
    </li>
  );
}

// Styles
// ------------------------------

function useGroupStyles() {
  return css({
    '&:not(:first-child)': {
      marginBlockStart: listBlockGutter,
    },
    '&:not(:last-child)': {
      marginBlockEnd: listBlockGutter,
    },
  });
}

function useHeadingStyles() {
  return css({
    color: tokenSchema.color.foreground.neutralSecondary,
    fontSize: tokenSchema.fontsize.text.small.size,
    fontWeight: tokenSchema.typography.fontWeight.medium,
    paddingBlock: tokenSchema.size.space.regular,
    paddingInlineEnd: itemContentGutter,
    paddingInlineStart: textInsetStart,
    textTransform: 'uppercase',
  });
}

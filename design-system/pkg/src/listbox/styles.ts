import { css, tokenSchema } from '@keystar/ui/style';

export const listStyles = css({
  borderRadius: 'inherit',
  maxHeight: 'inherit',
  // maxWidth: tokenSchema.size.dialog.small,
  outline: 0,
  overflowY: 'auto',
  paddingBlock: tokenSchema.size.space.small,
  userSelect: 'none',
});

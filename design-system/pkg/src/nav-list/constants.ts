import { tokenSchema } from '@keystar/ui/style';

export const listBlockGutter = tokenSchema.size.space.large;

export const itemIndicatorGutter = tokenSchema.size.space.regular;
export const itemIndicatorWidth = tokenSchema.size.space.small;
export const itemContentGutter = tokenSchema.size.space.medium;

export const textInsetStart = `calc(${itemIndicatorWidth} + ${itemIndicatorGutter} + ${itemContentGutter})`;

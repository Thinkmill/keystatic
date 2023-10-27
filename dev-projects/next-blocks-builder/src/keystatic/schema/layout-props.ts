import { fields } from '@keystatic/core';

const surfaceOptions = [
  { label: 'White', value: 'white' },
  { label: 'Off-White', value: 'off-white' },
  { label: 'Black', value: 'black' },
  { label: 'Off-Black', value: 'off-black' },
  { label: 'Splash', value: 'splash' },
] as const;

const spacingOptions = [
  { label: 'Large', value: 'large' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'None', value: 'none' },
] as const;

const containerWidthOptions = [
  { label: 'Full', value: 'full' },
  { label: 'Large', value: 'large' },
  { label: 'Medium', value: 'medium' },
  { label: 'Narrow', value: 'narrow' },
] as const;

export type Surface = (typeof surfaceOptions)[number]['value'];
export type Spacing = (typeof spacingOptions)[number]['value'];
export type ContainerWidth = (typeof containerWidthOptions)[number]['value'];

export type LayoutProps = {
  marginTop: Spacing;
  surface: Surface;
  paddingTop: Spacing;
  paddingBottom: Spacing;
  containerWidth: ContainerWidth;
};

// ----------------------------------
// Shared layout props for all "blocks"
// ----------------------------------
export const marginTop = fields.select({
  label: 'Margin top',
  options: spacingOptions,
  defaultValue: 'none',
});

export const surface = fields.select({
  label: 'Surface (background color)',
  options: surfaceOptions,
  defaultValue: 'white',
});

export const paddingTop = fields.select({
  label: 'Padding top',
  options: spacingOptions,
  defaultValue: 'medium',
});

export const paddingBottom = fields.select({
  label: 'Padding bottom',
  options: spacingOptions,
  defaultValue: 'medium',
});

export const containerWidth = fields.select({
  label: 'Container width',
  options: containerWidthOptions,
  defaultValue: 'medium',
});

// Grouped in an object field
export const layoutProps = fields.object({
  marginTop,
  surface,
  paddingTop,
  paddingBottom,
  containerWidth,
});

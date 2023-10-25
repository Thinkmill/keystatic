import { fields } from '@keystatic/core';

export type Surface = 'white' | 'off-white' | 'black' | 'off-black' | 'splash';
export type Padding = 'large' | 'medium' | 'small' | 'none';
export type ContainerWidth = 'full' | 'narrow' | 'normal';

export type LayoutProps = {
  surface: Surface;
  paddingTop: Padding;
  paddingBottom: Padding;
  containerWidth: ContainerWidth;
};

// ----------------------------------
// Shared layout props for all "blocks"
// ----------------------------------
export const surface = fields.select({
  label: 'Surface (background color)',
  options: [
    { label: 'White', value: 'white' },
    { label: 'Off-White', value: 'off-white' },
    { label: 'Black', value: 'black' },
    { label: 'Off-Black', value: 'off-black' },
    { label: 'Splash', value: 'splash' },
  ],
  defaultValue: 'white',
});

export const paddingTop = fields.select({
  label: 'Padding top',
  options: [
    { label: 'Large', value: 'large' },
    { label: 'Medium', value: 'medium' },
    { label: 'Small', value: 'small' },
    { label: 'None', value: 'none' },
  ],
  defaultValue: 'medium',
});

export const paddingBottom = fields.select({
  label: 'Padding bottom',
  options: [
    { label: 'Large', value: 'large' },
    { label: 'Medium', value: 'medium' },
    { label: 'Small', value: 'small' },
    { label: 'None', value: 'none' },
  ],
  defaultValue: 'medium',
});

export const containerWidth = fields.select({
  label: 'Container width',
  options: [
    { label: 'Full', value: 'full' },
    { label: 'Narrow', value: 'narrow' },
    { label: 'Normal', value: 'normal' },
  ],
  defaultValue: 'normal',
});

// Grouped in an object field
export const layoutProps = fields.object({
  surface,
  paddingTop,
  paddingBottom,
  containerWidth,
});

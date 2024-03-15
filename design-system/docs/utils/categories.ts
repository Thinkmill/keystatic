export const categories = [
  'Introduction',
  'Concepts',
  'Layout',
  'Typography',
  'Forms',
  'Date and time',
  'Navigation',
  'Overlays',
  'Feedback',
  'Media',
] as const;

export type Category = (typeof categories)[number];

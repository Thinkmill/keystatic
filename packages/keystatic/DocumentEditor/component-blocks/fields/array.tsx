import { ComponentSchema, GenericPreviewProps, ArrayField } from '../api';

export function array<ElementField extends ComponentSchema>(
  element: ElementField,
  opts?: {
    label?: string;
    itemLabel?: (props: GenericPreviewProps<ElementField, unknown>) => string;
    asChildTag?: string;
  }
): ArrayField<ElementField> {
  return {
    kind: 'array',
    element,
    label: opts?.label ?? 'Items',
    itemLabel: opts?.itemLabel,
    asChildTag: opts?.asChildTag,
  };
}

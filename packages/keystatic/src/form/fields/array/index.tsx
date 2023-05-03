import {
  ComponentSchema,
  GenericPreviewProps,
  ArrayField,
  SlugFormField,
} from '../../api';

export function array<ElementField extends ComponentSchema>(
  element: ElementField,
  opts?: {
    label?: string;
    description?: string;
    itemLabel?: (props: GenericPreviewProps<ElementField, unknown>) => string;
    asChildTag?: string;
    slugField?: ElementField extends { kind: 'object' }
      ? {
          [K in keyof ElementField['fields']]: ElementField['fields'][K] extends SlugFormField<
            any,
            any,
            any,
            any
          >
            ? K
            : never;
        }[keyof ElementField['fields']]
      : never;
    validation?: {
      length?: {
        min?: number;
        max?: number;
      };
    };
  }
): ArrayField<ElementField> {
  return {
    kind: 'array',
    element,
    label: opts?.label ?? 'Items',
    description: opts?.description,
    itemLabel: opts?.itemLabel,
    asChildTag: opts?.asChildTag,
    slugField: opts?.slugField as string,
    validation: opts?.validation,
  };
}

import { cloudImageSchema } from '../../../component-blocks/cloud-image-schema';
import { ObjectField } from '../../api';
import { integer } from '../integer';
import { object } from '../object';
import { text } from '../text';
import { CloudImageFieldInput } from '#field-ui/cloudImage';

export function cloudImage({
  label,
  description,
  validation,
}: {
  label: string;
  description?: string;
  validation?: { isRequired?: boolean };
}): ObjectField<typeof cloudImageSchema> {
  return {
    ...object(
      {
        src: text({
          label: 'URL',
          validation: {
            length: {
              min: validation?.isRequired ? 1 : 0,
            },
          },
        }),
        alt: text({
          label: 'Alt text',
        }),
        height: integer({
          label: 'Height',
        }),
        width: integer({
          label: 'Width',
        }),
      },
      { label, description }
    ),
    Input(props) {
      return (
        <CloudImageFieldInput
          {...(props as any)}
          isRequired={validation?.isRequired}
        />
      );
    },
  };
}

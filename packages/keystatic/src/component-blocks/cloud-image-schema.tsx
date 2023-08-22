import { integer } from '../form/fields/integer';
import { text } from '../form/fields/text';

export const cloudImageSchema = {
  src: text({
    label: 'URL',
    validation: {
      length: {
        min: 1,
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
};

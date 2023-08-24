import { fields, component, NotEditable } from '@keystatic/core';

const codeFontFamily =
  'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace';

export const embed = component({
  label: 'Embed',
  preview: props => (
    <NotEditable
      style={{
        fontFamily: codeFontFamily,
        fontSize: '0.8rem',
      }}
    >
      {props.fields.embedCode.value || '(no embed code set)'}
    </NotEditable>
  ),
  schema: {
    mediaType: fields.select({
      label: 'Media type',
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Tweet', value: 'tweet' },
      ],
      defaultValue: 'video',
    }),
    embedCode: fields.text({
      label: 'Embed code',
      multiline: true,
    }),
  },
});

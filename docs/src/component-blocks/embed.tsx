import { fields, component, NotEditable } from '@keystatic/core';

export const embed = component({
  label: 'Embed',
  preview: props => (
    <NotEditable>
      <pre>
        <code>{props.fields.embedCode.value || '(no embed code set)'}</code>
      </pre>
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

import { fields, component, NotEditable } from '@keystatic/core';

export const fieldDemo = component({
  preview: props => {
    return (
      <NotEditable>
        Field: {props.fields.field.value || '(none selected)'}
      </NotEditable>
    );
  },
  label: 'Field demo',
  schema: {
    field: fields.select({
      label: 'Field',
      defaultValue: 'text',
      options: [
        { label: 'Date', value: 'date' },
        { label: 'Datetime', value: 'datetime' },
        { label: 'File', value: 'file' },
        { label: 'Image', value: 'image' },
        { label: 'Integer', value: 'integer' },
        { label: 'Multiselect', value: 'multiselect' },
        { label: 'Select', value: 'select' },
        { label: 'Slug', value: 'slug' },
        { label: 'Text', value: 'text' },
        { label: 'URL', value: 'url' },
      ],
    }),
  },
});

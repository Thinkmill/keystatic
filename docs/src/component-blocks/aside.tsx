import { fields, component, NotEditable } from '@keystatic/core';

export const aside = component({
  preview: props => {
    return (
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <NotEditable>{props.fields.icon.value}</NotEditable>
        <div>{props.fields.content.element}</div>
      </div>
    );
  },
  label: 'Aside',
  schema: {
    icon: fields.text({
      label: 'Emoji icon...',
    }),
    content: fields.child({
      kind: 'block',
      placeholder: 'Aside...',
      formatting: {
        inlineMarks: 'inherit',
        softBreaks: 'inherit',
        listTypes: 'inherit',
      },
      links: 'inherit',
    }),
  },
});

import { fields, component, NotEditable } from '@keystatic/core';

export const tags = component({
  preview: props => {
    return (
      <NotEditable>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {props.fields.tags.value.map(tag => (
            <span
              style={{
                border: 'solid 1px #ddd',
                padding: '0.25rem 0.5rem',
                borderRadius: '20px',
                fontSize: '11px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </NotEditable>
    );
  },
  label: 'Project',
  schema: {
    tags: fields.multiselect({
      label: 'Project tags',
      options: [
        { label: 'Local', value: 'Local' },
        { label: 'Github', value: 'github' },
        { label: 'New project', value: 'New project' },
        { label: 'Existing project', value: 'Existing project' },
        { label: 'Astro', value: 'Astro' },
        { label: 'Next.js', value: 'Next.js' },
      ],
    }),
  },
  chromeless: false,
});

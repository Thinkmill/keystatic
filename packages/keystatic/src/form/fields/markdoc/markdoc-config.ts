import { nodes, Config, NodeType, SchemaAttribute } from '#markdoc';
import { MarkdocEditorOptions, editorOptionsToConfig } from './config';
import { ComponentSchema } from '../../api';
import { ContentComponent } from '../../../content-components';

function getTypeForField(field: ComponentSchema): SchemaAttribute {
  if (field.kind === 'object' || field.kind === 'conditional') {
    return { type: Object, required: true };
  }
  if (field.kind === 'array') {
    return { type: Array, required: true };
  }
  if (field.kind === 'child') {
    return {};
  }
  if (field.formKind === undefined) {
    if (
      typeof field.defaultValue === 'string' &&
      'options' in field &&
      Array.isArray(field.options) &&
      field.options.every(
        (val: unknown): val is { value: string } =>
          typeof val === 'object' &&
          val !== null &&
          'value' in val &&
          typeof val.value === 'string'
      )
    ) {
      return {
        type: String,
        matches: field.options.map(x => x.value),
        required: true,
      };
    }
    if (typeof field.defaultValue === 'string') {
      let required = false;
      try {
        field.parse('');
      } catch {
        required = true;
      }
      return { type: String, required };
    }
    try {
      field.parse(1);
      return { type: Number };
    } catch {}
    if (typeof field.defaultValue === 'boolean') {
      return { type: Boolean, required: true };
    }
    return {};
  }
  if (field.formKind === 'slug') {
    let required = false;
    try {
      field.parse('', undefined);
    } catch {
      required = true;
    }
    return { type: String, required };
  }
  if (field.formKind === 'asset') {
    let required = false;
    try {
      field.validate(null);
    } catch {
      required = true;
    }
    return { type: String, required };
  }
  return {};
}

function fieldsToMarkdocAttributes(
  fields: Record<string, ComponentSchema>
): Record<string, SchemaAttribute> {
  return Object.fromEntries(
    Object.entries(fields).map(([name, field]) => {
      const schema: SchemaAttribute = getTypeForField(field);
      return [name, schema];
    })
  );
}

export function createMarkdocConfig<
  Components extends Record<string, ContentComponent>,
>(opts: {
  options?: MarkdocEditorOptions;
  components?: Components;
  render?: {
    tags?: { [_ in keyof Components]?: string };
    nodes?: { [_ in NodeType]?: string };
  };
}): Config {
  const editorConfig = editorOptionsToConfig(opts.options || {});
  const config: Config & { nodes: {}; tags: {} } = {
    nodes: { ...nodes },
    tags: {},
  };
  if (editorConfig.heading.levels.length) {
    config.nodes.heading = {
      ...nodes.heading,
      attributes: {
        ...nodes.heading.attributes,
        ...fieldsToMarkdocAttributes(editorConfig.heading.schema),
      },
    };
  } else {
    config.nodes.heading = undefined;
  }
  if (!editorConfig.blockquote) {
    config.nodes.blockquote = undefined;
  }
  if (editorConfig.codeBlock) {
    config.nodes.fence = {
      ...nodes.fence,
      attributes: {
        ...nodes.fence.attributes,
        ...fieldsToMarkdocAttributes(editorConfig.codeBlock.schema),
      },
    };
  } else {
    config.nodes.fence = undefined;
  }
  if (!editorConfig.orderedList && !editorConfig.unorderedList) {
    config.nodes.list = undefined;
  }
  if (!editorConfig.bold) {
    config.nodes.strong = undefined;
  }
  if (!editorConfig.italic) {
    config.nodes.em = undefined;
  }
  if (!editorConfig.strikethrough) {
    config.nodes.s = undefined;
  }
  if (!editorConfig.link) {
    config.nodes.link = undefined;
  }
  if (!editorConfig.image) {
    config.nodes.image = undefined;
  }
  if (!editorConfig.divider) {
    config.nodes.hr = undefined;
  }
  if (!editorConfig.table) {
    config.nodes.table = undefined;
  }
  for (const [name, component] of Object.entries(opts.components || {})) {
    const isEmpty = component.kind === 'block' || component.kind === 'inline';
    config.tags[name] = {
      render: opts.render?.tags?.[name],
      children: isEmpty ? [] : undefined,
      selfClosing: isEmpty,
      attributes: fieldsToMarkdocAttributes(component.schema),
      description:
        'description' in component ? component.description : undefined,
      inline: component.kind === 'inline' || component.kind === 'mark',
    };
  }
  for (const [name, render] of Object.entries(opts.render?.nodes || {})) {
    const nodeSchema = config.nodes[name as NodeType];
    if (nodeSchema) {
      nodeSchema.render = render;
    }
  }
  return config;
}

import { Node, Schema, Tag } from '@markdoc/markdoc';
import { transformSync, Message } from 'esbuild';

export type LiveCodeInfo = {
  code: string;
  exampleType: 'function' | 'jsx';
  location: string;
  error?: unknown;
};

function getCompilationResult(content: string): Omit<LiveCodeInfo, 'location'> {
  let code: string = content;
  const exampleType = content.startsWith('<') ? 'jsx' : 'function';
  if (exampleType === 'jsx') {
    code = `return (${content}\n)`;
  }
  let transformed: string;
  try {
    transformed = transformSync(code, { jsx: 'transform', loader: 'jsx' }).code;
  } catch (err) {
    return {
      error: err,
      exampleType,
      code: 'return "This example failed to compile"',
    };
  }
  return {
    code: transformed,
    exampleType: exampleType,
  };
}

const cache = new WeakMap<Node, LiveCodeInfo>();

function cachedGetCompiledCode(node: Node, code: string): LiveCodeInfo {
  if (cache.has(node)) {
    return cache.get(node)!;
  }

  const result = {
    ...getCompilationResult(code),
    location: node.location
      ? `${node.location.file ?? '(unknown file)'}:${node.location.start.line}`
      : '(unknown location)',
  };

  cache.set(node, result);
  return result;
}

export const fence: Schema = {
  render: 'CodeBlock',
  attributes: {
    content: { type: String },
    language: { type: String },
    emphasis: { type: String },
    live: { type: Boolean, required: false, default: false },
  },
  validate(node, config) {
    const attributes = node.transformAttributes(config);
    if (!attributes.live) {
      return [];
    }
    const compiled = cachedGetCompiledCode(node, attributes.content);
    if (!compiled.error) {
      return [];
    }

    const esbuildErrors: Message[] | undefined = (compiled.error as any)
      ?.errors;
    if (esbuildErrors) {
      return esbuildErrors.map(error => {
        return {
          id: 'live-code-compilation',
          level: 'critical',
          message: error.text,
          location:
            error.location && node.location
              ? {
                  start: {
                    line: node.location.start.line + error.location.line,
                    character: error.location.column,
                  },
                  end: {
                    line: node.location.start.line + error.location.line,
                    character: error.location.column,
                  },
                }
              : undefined,
        };
      });
    }

    return [
      {
        id: 'live-code-compilation',
        level: 'critical',
        message: compiled.error + '',
        location: node.location,
      },
    ];
  },
  transform(node, config) {
    const children = node.transformChildren(config);
    const attributes = node.transformAttributes(config);
    if (attributes.live) {
      return new Tag(
        'LiveCode',
        {
          ...attributes,
          live: cachedGetCompiledCode(node, attributes.content),
          content: attributes.content.trim(),
        },
        children
      );
    }
    return new Tag(
      this.render,
      { ...attributes, content: attributes.content.trim() },
      children
    );
  },
};

type InlineMarksConfig =
  | 'inherit'
  | {
      bold?: 'inherit';
      code?: 'inherit';
      italic?: 'inherit';
      strikethrough?: 'inherit';
      underline?: 'inherit';
      keyboard?: 'inherit';
      subscript?: 'inherit';
      superscript?: 'inherit';
    };

type BlockFormattingConfig = {
  alignment?: 'inherit';
  blockTypes?: 'inherit';
  headingLevels?: 'inherit' | (1 | 2 | 3 | 4 | 5 | 6)[];
  inlineMarks?: InlineMarksConfig;
  listTypes?: 'inherit';
  softBreaks?: 'inherit';
  componentBlocks?: 'inherit';
};

export type ChildField = {
  kind: 'child';
  options:
    | {
        kind: 'block';
        placeholder: string;
        formatting?: BlockFormattingConfig;
        dividers?: 'inherit';
        links?: 'inherit';
        images?: 'inherit';
        tables?: 'inherit';
        componentBlocks?: 'inherit';
      }
    | {
        kind: 'inline';
        placeholder: string;
        formatting?: {
          inlineMarks?: InlineMarksConfig;
          softBreaks?: 'inherit';
        };
        links?: 'inherit';
      };
};

export function child(
  options:
    | {
        kind: 'block';
        placeholder: string;
        formatting?: BlockFormattingConfig | 'inherit';
        dividers?: 'inherit';
        links?: 'inherit';
        images?: 'inherit';
        tables?: 'inherit';
        componentBlocks?: 'inherit';
      }
    | {
        kind: 'inline';
        placeholder: string;
        formatting?:
          | 'inherit'
          | {
              inlineMarks?: InlineMarksConfig;
              softBreaks?: 'inherit';
            };
        links?: 'inherit';
      }
): ChildField {
  return {
    kind: 'child',
    options:
      options.kind === 'block'
        ? {
            kind: 'block',
            placeholder: options.placeholder,
            dividers: options.dividers,
            formatting:
              options.formatting === 'inherit'
                ? {
                    blockTypes: 'inherit',
                    headingLevels: 'inherit',
                    inlineMarks: 'inherit',
                    listTypes: 'inherit',
                    alignment: 'inherit',
                    softBreaks: 'inherit',
                  }
                : options.formatting,
            links: options.links,
            images: options.images,
            tables: options.tables,
            componentBlocks: options.componentBlocks,
          }
        : {
            kind: 'inline',
            placeholder: options.placeholder,
            formatting:
              options.formatting === 'inherit'
                ? { inlineMarks: 'inherit', softBreaks: 'inherit' }
                : options.formatting,
            links: options.links,
          },
  };
}

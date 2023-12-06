type InlineMarksConfig = 'inherit' | {
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
    options: ({
        kind: 'block';
        formatting?: BlockFormattingConfig;
        dividers?: 'inherit';
        links?: 'inherit';
        images?: 'inherit';
        tables?: 'inherit';
        componentBlocks?: 'inherit';
    } & BlockEditingOptions) | {
        kind: 'inline';
        placeholder: string;
        formatting?: {
            inlineMarks?: InlineMarksConfig;
            softBreaks?: 'inherit';
        };
        links?: 'inherit';
    };
};
type BlockEditingOptions = {
    editIn?: 'preview';
    placeholder: string;
} | {
    editIn: 'modal';
    label: string;
} | {
    editIn: 'both';
    label: string;
    placeholder: string;
};
export declare function child(options: ({
    kind: 'block';
    formatting?: BlockFormattingConfig | 'inherit';
    dividers?: 'inherit';
    links?: 'inherit';
    images?: 'inherit';
    tables?: 'inherit';
    componentBlocks?: 'inherit';
} & BlockEditingOptions) | {
    kind: 'inline';
    placeholder: string;
    formatting?: 'inherit' | {
        inlineMarks?: InlineMarksConfig;
        softBreaks?: 'inherit';
    };
    links?: 'inherit';
}): ChildField;
export {};

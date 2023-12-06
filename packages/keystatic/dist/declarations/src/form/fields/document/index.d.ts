import { DocumentFeatures } from "./DocumentEditor/document-features.js";
import { BasicFormField, ComponentBlock, ComponentSchema, DocumentElement, ContentFormField, SlugFormField } from "../../api.js";
type HeadingLevels = true | readonly (1 | 2 | 3 | 4 | 5 | 6)[];
type FormattingConfig = {
    inlineMarks?: true | {
        bold?: true;
        italic?: true;
        underline?: true;
        strikethrough?: true;
        code?: true;
        superscript?: true;
        subscript?: true;
        keyboard?: true;
    };
    listTypes?: true | {
        ordered?: true;
        unordered?: true;
    };
    alignment?: true | {
        center?: true;
        end?: true;
    };
    headingLevels?: HeadingLevels | {
        levels: HeadingLevels;
        schema?: Record<string, ComponentSchema>;
    };
    blockTypes?: true | {
        blockquote?: true;
        code?: true | {
            schema?: Record<string, ComponentSchema>;
        };
    };
    softBreaks?: true;
};
export type BasicStringFormField = BasicFormField<string> | SlugFormField<string, string, string, null>;
type DocumentFeaturesConfig = {
    formatting?: true | FormattingConfig;
    links?: true;
    dividers?: true;
    images?: true | {
        directory?: string;
        publicPath?: string;
        schema?: {
            alt?: BasicStringFormField;
            title?: BasicStringFormField;
        };
    };
    layouts?: readonly (readonly [number, ...number[]])[];
    tables?: true;
};
export declare function normaliseDocumentFeatures(config: DocumentFeaturesConfig): DocumentFeatures;
export declare function document({ label, componentBlocks, description, ...documentFeaturesConfig }: {
    label: string;
    componentBlocks?: Record<string, ComponentBlock>;
    description?: string;
} & DocumentFeaturesConfig): ContentFormField<DocumentElement[], DocumentElement[], DocumentElement[]>;
export {};

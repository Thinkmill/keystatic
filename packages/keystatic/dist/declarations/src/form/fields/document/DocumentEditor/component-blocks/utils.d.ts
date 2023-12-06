import { DocumentFeatures } from "../document-features.js";
import { DocumentFeaturesForNormalization } from "../document-features-normalization.js";
import { ComponentSchema, ChildField } from "../../../../api.js";
import { Descendant } from 'slate';
export type DocumentFeaturesForChildField = {
    kind: 'inline';
    inlineMarks: 'inherit' | DocumentFeatures['formatting']['inlineMarks'];
    documentFeatures: {
        links: boolean;
    };
    softBreaks: boolean;
} | {
    kind: 'block';
    inlineMarks: 'inherit' | DocumentFeatures['formatting']['inlineMarks'];
    softBreaks: boolean;
    componentBlocks: boolean;
    documentFeatures: DocumentFeaturesForNormalization;
};
export declare function getWholeDocumentFeaturesForChildField(editorDocumentFeatures: DocumentFeatures, options: ChildField['options'] & {
    kind: 'block';
}): DocumentFeatures;
export declare function getDocumentFeaturesForChildField(editorDocumentFeatures: DocumentFeatures, options: ChildField['options']): DocumentFeaturesForChildField;
export declare function getSchemaAtPropPath(path: ReadonlyPropPath, value: Record<string, unknown>, props: Record<string, ComponentSchema>): undefined | ComponentSchema;
export declare function getAncestorSchemas(rootSchema: ComponentSchema, path: ReadonlyPropPath, value: unknown): ComponentSchema[];
export type ReadonlyPropPath = readonly (string | number)[];
export declare function getPlaceholderTextForPropPath(propPath: ReadonlyPropPath, fields: Record<string, ComponentSchema>, formProps: Record<string, any>): string;
export declare function cloneDescendent(node: Descendant): Descendant;

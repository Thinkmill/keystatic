import { Config as MarkdocConfig, Node as MarkdocNode } from '@markdoc/markdoc';
import { ContentFormField } from "../../api.js";
import type { EditorState } from 'prosemirror-state';
/**
 * @deprecated This is experimental and buggy, use at your own risk.
 */
export declare function __experimental_markdoc_field({ label, description, config, }: {
    label: string;
    description?: string;
    config: MarkdocConfig;
}): __experimental_markdoc_field.Field;
export declare namespace __experimental_markdoc_field {
    type Field = ContentFormField<EditorState, EditorState, {
        ast: MarkdocNode;
    }>;
}

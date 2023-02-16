import { createContext, useContext } from 'react';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';

export type Relationships = Record<
  string,
  {
    listKey: string;
    /** GraphQL fields to select when querying the field */
    selection: string | null;
    label: string;
  }
>;

export const DocumentFieldRelationshipsContext = createContext<Relationships>(
  {}
);

export function useDocumentFieldRelationships() {
  return useContext(DocumentFieldRelationshipsContext);
}

export const DocumentFieldRelationshipsProvider =
  DocumentFieldRelationshipsContext.Provider;

export function withRelationship(editor: Editor): Editor {
  const { isVoid, isInline } = editor;
  editor.isVoid = element => {
    return element.type === 'relationship' || isVoid(element);
  };
  editor.isInline = element => {
    return element.type === 'relationship' || isInline(element);
  };
  return editor;
}

export function RelationshipElement({}: RenderElementProps & {
  element: { type: 'relationship' };
}) {
  return null;
}

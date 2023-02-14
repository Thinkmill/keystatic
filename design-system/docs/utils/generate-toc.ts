import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';
import { isTag, stringifyDocContent } from './utils';

export type HeadingEntry = {
  items: HeadingEntry[];
  id: string;
  title: string;
  level: number;
  titleContent: RenderableTreeNodes;
};

export function generateToc(content: Tag): HeadingEntry[] {
  const nestedHeadings: HeadingEntry[] = [];

  for (const child of content.children) {
    if (isTag(child) && child.name === 'Heading') {
      const id: string = child.attributes.id;
      const level: number = child.attributes.level;
      const entry: HeadingEntry = {
        id,
        level,
        title: stringifyDocContent(child),
        titleContent: child.children,
        items: [],
      };
      if (level === 2) {
        nestedHeadings.push(entry);
      } else if (level === 3 && nestedHeadings.length > 0) {
        nestedHeadings[nestedHeadings.length - 1].items.push(entry);
      }
    }
  }

  return nestedHeadings;
}

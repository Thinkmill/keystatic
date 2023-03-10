// it's very important that this file is
// NOT IMPORTED BY ANYTHING
// this file contains module augmentation, if it is imported
// then it will be in the generated declarations which means it will pollute
// the consumers types if they're already using slate
//
// ideally Slate would use generics instead of module augmentation so this
// wouldn't be a problem but for now, it is so
// DO NOT IMPORT THIS FILE
import { BaseEditor, BaseElement, BaseRange } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { ReadonlyPropPath } from './component-blocks/utils';
import { Mark } from './utils';

type Link = {
  type: 'link';
  href: string;
};

type Layout = {
  type: 'layout';
  layout: number[];
};

type OnlyChildrenElements = {
  type:
    | 'blockquote'
    | 'layout-area'
    | 'divider'
    | 'list-item'
    | 'list-item-content'
    | 'ordered-list'
    | 'unordered-list'
    | 'table'
    | 'table-body'
    | 'table-head'
    | 'table-row';
};

type TableCell = {
  type: 'table-cell';
  header?: true;
  rowSpan?: number;
  colSpan?: number;
};

type CodeBlock = {
  type: 'code';
  language?: string;
};

type Heading = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: 'center' | 'end' | undefined;
};

type Paragraph = {
  type: 'paragraph';
  textAlign?: 'center' | 'end' | undefined;
};

type ComponentBlock = {
  type: 'component-block';
  component: string;
  props: Record<string, any>;
};

type ComponentProp = {
  type: 'component-inline-prop' | 'component-block-prop';
  propPath?: ReadonlyPropPath | undefined;
};

type Image = {
  type: 'image';
  src: { filename: string; content: Uint8Array };
  alt: string;
  title: string;
};

type Element = (
  | Layout
  | OnlyChildrenElements
  | Heading
  | ComponentBlock
  | ComponentProp
  | Paragraph
  | Link
  | CodeBlock
  | Image
  | TableCell
) &
  BaseElement;
declare module 'slate' {
  interface CustomTypes {
    Element: Element;
    Range: { placeholder?: string } & BaseRange;
    Editor: { type?: undefined } & BaseEditor & ReactEditor & HistoryEditor;
    Text: {
      type?: undefined;
      text: string;
      placeholder?: string;
    } & { [Key in Mark | 'insertMenu']?: true };
  }
}

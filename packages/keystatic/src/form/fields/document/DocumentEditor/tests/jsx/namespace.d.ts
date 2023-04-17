import { Element, Node } from 'slate';
import { Mark } from '../../utils';

export const __jsx: any;

type Children = Node | string | Children[];

type Elements = {
  [Key in Element['type']]: Omit<
    Element & { type: Key },
    'type' | 'children'
  > & { children: Children };
};
declare namespace __jsx {
  namespace JSX {
    type IntrinsicElements = Elements & {
      editor: {
        children: Children;
        marks?: { [Key in Mark | 'insertMenu']?: true };
      };
      text: { children?: Children } & { [Key in Mark | 'insertMenu']?: true };
      element: { [key: string]: any };
      cursor: { [key: string]: never };
      anchor: { [key: string]: never };
      focus: { [key: string]: never };
    };
    type Element = Node;
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

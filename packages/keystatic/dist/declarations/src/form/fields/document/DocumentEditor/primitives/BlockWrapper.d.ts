import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
type BlockWrapperProps = {
    attributes?: RenderElementProps['attributes'];
    children: ReactNode;
    draggable?: boolean;
};
export declare const BlockWrapper: (props: BlockWrapperProps) => import("react").JSX.Element;
export {};

import React, { ReactNode } from 'react';
export type Router = {
    push: (path: string) => void;
    replace: (path: string) => void;
    href: string;
    params: string[];
};
export declare function RouterProvider(props: {
    children: ReactNode;
}): React.JSX.Element;
export declare function useRouter(): Router;

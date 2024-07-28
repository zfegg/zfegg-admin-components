/// <reference types="vite/client" />

declare const GIT_BRANCH: string;
declare const GIT_HASH: string;

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<
        SVGSVGElement
    > & { title?: string }>;

    const src: string;
    export default ReactComponent;
}

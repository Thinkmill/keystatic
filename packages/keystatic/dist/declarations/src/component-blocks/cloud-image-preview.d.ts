/// <reference types="react" />
import { PreviewProps, ObjectField, Config } from "../index.js";
export type CloudImageProps = {
    src: string;
    width?: number;
    height?: number;
    alt: string;
};
type ImageDimensions = Pick<CloudImageProps, 'width' | 'height'>;
export declare function parseImageData(data: string): CloudImageProps;
export declare function loadImageData(url: string, config: Config): Promise<CloudImageProps>;
export declare function ImageDimensionsInput(props: {
    src: string;
    image: ImageDimensions;
    onChange: (image: ImageDimensions) => void;
}): import("react").JSX.Element;
export declare const emptyImageData: CloudImageProps;
export declare function CloudImagePreview(props: PreviewProps<ObjectField<typeof import("./cloud-image-schema.js").cloudImageSchema>> & {
    onRemove(): void;
}): import("react").JSX.Element;
export declare function useImageLibraryURL(): string;
export declare const cloudImageToolbarIcon: import("react").JSX.Element;
export {};

export type KeystaticRequest = {
    headers: {
        get(name: string): string | null;
    };
    method: string;
    url: string;
    json: () => Promise<any>;
};
export type KeystaticResponse = ResponseInit & {
    body: Uint8Array | string | null;
};
export declare function redirect(to: string, initialHeaders?: [string, string][]): KeystaticResponse;

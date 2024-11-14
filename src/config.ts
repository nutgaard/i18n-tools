export const validFormats = ['script', 'json', 'jsonlut', 'formatjs'];
export type Format = 'script' | 'json' | 'jsonlut' | 'formatjs';

export interface BuildOptions {
    format: Format;
    typescript: boolean;
    strict: boolean;
    ast: boolean;
    lut: boolean;
    timeZone?: string;
    exitOnError?: boolean;
    hasFixerListener?: boolean;
}

export interface WatchOptions {
    format: Format;
    typescript: boolean;
    strict: boolean;
    ast: boolean;
    lut: boolean;
}

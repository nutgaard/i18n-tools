export const validFormats = ['script', 'json', 'jsonlut', 'formatjs'];
export type Format = 'script' | 'json' | 'jsonlut' | 'formatjs';

export interface BuildOptions {
    srcDir: string;
    outDir: string;
    format: Format;
    typescript: boolean;
    strict: boolean;
    ast: boolean;
    lut: boolean;
    exitOnError?: boolean;
    hasFixerListener?: boolean;
}

export interface FixOptions {
    srcDir: string;
}

export interface ValidateOptions {
    srcDir: string;
}

export interface WatchOptions {
    srcDir: string;
    outDir: string;
    format: Format;
    typescript: boolean;
    strict: boolean;
    ast: boolean;
    lut: boolean;
}

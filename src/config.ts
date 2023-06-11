export type Format = 'script' | 'json' | 'formatjs';

export interface Config {
    command: string;
    srcDir: string;
    outDir: string;
    bundleFormat: Format;
    typescript: boolean;
    validate: boolean;
    ast: boolean;
    lut: boolean;
}

export const defaultConfig: Config = {
    command: '',
    srcDir: '',
    outDir: '',
    bundleFormat: 'formatjs',
    typescript: false,
    validate: false,
    ast: false,
    lut: false,
};

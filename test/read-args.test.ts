import { describe, it, expect } from 'vitest';
import { readArgs } from '../src/utils/read-args';
import { defaultConfig } from '../src/config';

describe('readArgs', () => {
    it('should parse minimal cli command and use defaults', () => {
        const cli = 'help';

        const config = readArgs(cli.split(' '));

        expect(config).toEqual({
            ...defaultConfig,
            srcDir: undefined,
            command: 'help',
        });
    });

    it('should parse minimal cli command and use defaults', () => {
        const cli = 'build source output';

        const config = readArgs(cli.split(' '));

        expect(config).toEqual({
            ...defaultConfig,
            srcDir: 'source',
            outDir: 'output',
            command: 'build',
        });
    });

    it('should parse cli command with options', () => {
        const cli = 'watch source output -f formatjs --strict --ast --lut --typescript';

        const config = readArgs(cli.split(' '));

        expect(config).toEqual({
            command: 'watch',
            srcDir: 'source',
            outDir: 'output',
            bundleFormat: 'formatjs',
            typescript: true,
            validate: true,
            ast: true,
            lut: true,
        });
    });

    it('should throw error if format is invalid', () => {
        const cli = 'watch source output --format invalid --strict --ast --lut --typescript';

        expect(() => readArgs(cli.split(' '))).toThrowError('Invalid format');
    });

    it('should throw error if ast is enabled without formatjs format', () => {
        const cli = 'watch source output --format script --strict --ast --lut --typescript';

        expect(() => readArgs(cli.split(' '))).toThrowError('Cannot compile output');
    });
});

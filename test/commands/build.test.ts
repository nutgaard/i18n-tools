import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { createLogger } from 'winston';
import Build from '../../src/commands/build';
import { buildVolumeFromFs } from '../build-volume-from-fs';

const defaultConfig = {
    srcDir: '/app/messages',
    outDir: '/app/compiled',
};

describe('build command', () => {
    afterEach(() => {
        vol.reset();
    });

    it('should build lut and compiled', async () => {
        vol.fromNestedJSON(
            {
                'ignore.txt': 'some content',
                'first_en.txt': 'first content',
                'first_nb.txt': 'first content',
                folder: {
                    'ignore.txt': 'some content',
                    'second_en.txt': 'some content',
                    'second_nb.txt': 'some content',
                    nested: {
                        'third_en.txt': 'second content',
                        'third_nb.txt': 'second content',
                    },
                },
            },
            '/app/messages',
        );

        await Build.run(createLogger(), {
            ...defaultConfig,
            strict: true,
            typescript: true,
            ast: true,
            lut: true,
            format: 'formatjs',
        });

        expect(vol.toJSON('/app/compiled')).toMatchSnapshot();
    });

    it('should build lut in javascript', async () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                'first_nb.txt': 'first content',
                folder: {
                    'second_en.txt': 'some content',
                    'second_nb.txt': 'some content',
                },
            },
            '/app/messages',
        );

        await Build.run(createLogger(), {
            ...defaultConfig,
            strict: true,
            typescript: false,
            ast: false,
            lut: true,
            format: 'script',
        });

        expect(vol.toJSON('/app/compiled')).toMatchSnapshot();
    });

    it('should build lut in typescript', async () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                'first_nb.txt': 'first content',
                folder: {
                    'second_en.txt': 'some content',
                    'second_nb.txt': 'some content',
                },
            },
            '/app/messages',
        );

        await Build.run(createLogger(), {
            ...defaultConfig,
            strict: true,
            typescript: true,
            ast: false,
            lut: true,
            format: 'script',
        });

        expect(vol.toJSON('/app/compiled')).toMatchSnapshot();
    });

    it('should throw error if validation is enabled and texts mismatch', async () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                'mismatch_nb.txt': 'first content',
            },
            '/app/messages',
        );

        expect(
            (async () => {
                await Build.run(createLogger(), {
                    ...defaultConfig,
                    strict: true,
                    typescript: true,
                    ast: true,
                    lut: true,
                    format: 'formatjs',
                });
            })(),
        ).rejects.toThrowError('');
    });

    it('should compile example', async () => {
        vol.fromNestedJSON(buildVolumeFromFs('example/messages'), '/app/messages');

        await Build.run(createLogger(), {
            ...defaultConfig,
            strict: true,
            typescript: true,
            ast: true,
            lut: true,
            format: 'formatjs',
        });

        expect(vol.toJSON('/app/compiled')).toMatchSnapshot();
    });
});

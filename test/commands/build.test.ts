import { describe, it, expect } from 'vitest';
import { vol } from 'memfs';
import Build from '../../src/commands/build';

describe('build command', () => {
    it('should build lut and compiled', async () => {
        vol.fromNestedJSON(
            {
                'ignore.txt': 'some content',
                'first-of-many_en.txt': 'first content',
                folder: {
                    'ignore.txt': 'some content',
                    nested: {
                        'second-file_en.txt': 'second content',
                    },
                },
            },
            '/app/messages',
        );

        await Build.run({
            srcDir: '/app/messages',
            outDir: '/app/compiled',
            command: 'build',
            validate: false,
            typescript: true,
            ast: true,
            lut: true,
            bundleFormat: 'formatjs',
        });

        expect(vol.toJSON('/app/compiled')).toMatchSnapshot();
    });
});

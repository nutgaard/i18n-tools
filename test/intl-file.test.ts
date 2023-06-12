import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { IntlFile } from '../src/utils/intl-file';

describe('intlfile', () => {
    afterEach(() => {
        vol.reset();
    });

    it('should parse files', () => {
        vol.fromNestedJSON(
            {
                'first-of-many_nb.txt': 'first content',
                folder: {
                    nested: {
                        'second-file_en.txt': 'second content',
                    },
                },
            },
            '/app',
        );

        const firstIntlFile = IntlFile.of('/app/first-of-many_nb.txt', '/app');
        const secondIntlFile = IntlFile.of('/app/folder/nested/second-file_en.txt', '/app');

        expect(firstIntlFile.content).toBe('first content');
        expect(firstIntlFile.locale).toBe('nb');
        expect(firstIntlFile.textId).toBe('first-of-many');
        expect(firstIntlFile.shortTextId).toBe('firstOfMany');
        expect(firstIntlFile.getPathParts()).toEqual([]);

        expect(secondIntlFile.content).toBe('second content');
        expect(secondIntlFile.locale).toBe('en');
        expect(secondIntlFile.textId).toBe('folder/nested/second-file');
        expect(secondIntlFile.shortTextId).toBe('secondFile');
        expect(secondIntlFile.getPathParts()).toEqual(['folder', 'nested']);
    });
});

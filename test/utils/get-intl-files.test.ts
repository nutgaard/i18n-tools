import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { getIntlFiles } from '../../src/utils/get-intl-files';
import { IntlFile } from '../../src/utils/intl-file';

describe('getIntlFiles', () => {
    afterEach(() => {
        vol.reset();
    });
    it('should return just intl-files', () => {
        vol.fromNestedJSON(
            {
                'ignore.txt': 'some content',
                'first-of-many_nb.txt': 'first content',
                folder: {
                    'ignore.txt': 'some content',
                    nested: {
                        'second-file_en.txt': 'second content',
                    },
                },
            },
            '/app',
        );

        const files = getIntlFiles('/app');
        const firstIntlFile = IntlFile.of('/app/first-of-many_nb.txt', '/app');
        const secondIntlFile = IntlFile.of('/app/folder/nested/second-file_en.txt', '/app');

        expect(files).toHaveLength(2);
        expect(files).toEqual([firstIntlFile, secondIntlFile]);
    });
});

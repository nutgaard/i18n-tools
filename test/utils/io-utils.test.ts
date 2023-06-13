import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { getAllFiles } from '../../src/utils/io-utils';

describe('getAllFiles', () => {
    afterEach(() => {
        vol.reset();
    });

    it('should should recursively return all files in directory', () => {
        vol.fromNestedJSON(
            {
                'first.txt': 'some content',
                'second.txt': 'some content',
                folder: {
                    'third.txt': 'some content',
                    nested: {
                        'fourth.txt': 'some content',
                    },
                },
            },
            '/app',
        );

        const files = getAllFiles('/app');
        const expectedFiles = [
            '/app/first.txt',
            '/app/second.txt',
            '/app/folder/third.txt',
            '/app/folder/nested/fourth.txt',
        ];
        expect(files).toHaveLength(4);
        expectedFiles.every((file) => expect(files).toContain(file));
    });
});

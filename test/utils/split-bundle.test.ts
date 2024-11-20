import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { getIntlFiles } from '../../src/utils/get-intl-files';
import { IntlFile } from '../../src/utils/intl-file';
import { splitBundleIntoFiles, TextEntry } from '../../src/utils/split-bundle';

describe('splitBundleIntoFiles', () => {
    afterEach(() => {
        vol.reset();
    });
    it('should split json formatted files', () => {
        vol.fromNestedJSON(
            {
                compiled: {
                    'bundle_no.json': JSON.stringify({
                        simplekey: 'simplekey',
                        'key/in/folder': 'key in folder',
                    }),
                },
            },
            '/app',
        );

        const files = splitBundleIntoFiles('/app/compiled/bundle_no.json', 'json');

        const firstIntlFile: TextEntry = {
            path: ['simplekey'],
            content: 'simplekey',
        };
        const secondIntlFile: TextEntry = {
            path: ['key', 'in', 'folder'],
            content: 'key in folder',
        };

        expect(files).toHaveLength(2);
        expect(files).toEqual([firstIntlFile, secondIntlFile]);
    });

    it('should split jsonlut formatted files', () => {
        vol.fromNestedJSON(
            {
                compiled: {
                    'bundle_no.json': JSON.stringify({
                        simplekey: 'simplekey',
                        key: {
                            in: {
                                folder: 'key in folder',
                            },
                        },
                    }),
                },
            },
            '/app',
        );

        const files = splitBundleIntoFiles('/app/compiled/bundle_no.json', 'jsonlut');

        const firstIntlFile: TextEntry = {
            path: ['simplekey'],
            content: 'simplekey',
        };
        const secondIntlFile: TextEntry = {
            path: ['key', 'in', 'folder'],
            content: 'key in folder',
        };

        expect(files).toHaveLength(2);
        expect(files).toEqual([firstIntlFile, secondIntlFile]);
    });

    it('should split formatjs formatted files', () => {
        vol.fromNestedJSON(
            {
                compiled: {
                    'bundle_no.json': JSON.stringify({
                        simplekey: {
                            defaultMessage: 'simplekey',
                        },
                        'key/in/folder': {
                            defaultMessage: 'key in folder',
                        },
                    }),
                },
            },
            '/app',
        );

        const files = splitBundleIntoFiles('/app/compiled/bundle_no.json', 'formatjs');

        const firstIntlFile: TextEntry = {
            path: ['simplekey'],
            content: 'simplekey',
        };
        const secondIntlFile: TextEntry = {
            path: ['key', 'in', 'folder'],
            content: 'key in folder',
        };

        expect(files).toHaveLength(2);
        expect(files).toEqual([firstIntlFile, secondIntlFile]);
    });
});

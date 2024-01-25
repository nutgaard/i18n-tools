import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { createLogger } from 'winston';
import Fix from '../../src/commands/fix';

describe('fix command', () => {
    afterEach(() => {
        vol.reset();
    });

    it('should create files missing for locales', () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                folder: {
                    'second_nb.txt': 'some content',
                },
            },
            '/app/messages',
        );

        Fix.run(
            createLogger(),
            {
                srcDir: '/app/messages',
            },
            false,
        );

        expect(vol.toJSON('/app/messages')).toMatchSnapshot();
    });

    it('should not exit if no errors are found', () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                'first_nb.txt': 'first content',
            },
            '/app/messages',
        );

        Fix.run(
            createLogger(),
            {
                srcDir: '/app/messages',
            },
            false,
        );

        expect(vol.toJSON('/app/messages')).toMatchSnapshot();
    });
});

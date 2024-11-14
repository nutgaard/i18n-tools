import { describe, it, expect, afterEach } from 'vitest';
import { vol } from 'memfs';
import { runFixCommand } from '../../src/commands/fix';

describe('fix command', () => {
    afterEach(() => {
        vol.reset();
    });

    it('should create files missing for locales', async () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                folder: {
                    'second_nb.txt': 'some content',
                },
            },
            '/app/messages',
        );

        await runFixCommand('/app/messages', false);

        expect(vol.toJSON('/app/messages')).toMatchSnapshot();
    });

    it('should not exit if no errors are found', async () => {
        vol.fromNestedJSON(
            {
                'first_en.txt': 'first content',
                'first_nb.txt': 'first content',
            },
            '/app/messages',
        );

        await runFixCommand('/app/messages', false);

        expect(vol.toJSON('/app/messages')).toMatchSnapshot();
    });
});

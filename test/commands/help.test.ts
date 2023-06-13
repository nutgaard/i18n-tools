import { afterEach, describe, expect, it, vi } from 'vitest';
import Help from '../../src/commands/help';

describe('help command', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should print help message', async () => {
        const spy = vi.spyOn(console, 'log');
        await Help.run();

        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.lastCall).toMatchSnapshot();
    });
});

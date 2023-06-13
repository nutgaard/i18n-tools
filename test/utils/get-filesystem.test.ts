import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import { getFilesystem } from '../../src/utils/get-filesystem';

describe('getFilesystem', () => {
    it('should return inmemory filesystem during test', () => {
        const memfs = getFilesystem();
        const filename = '/test.txt';

        memfs.writeFileSync(filename, 'some data');

        expect(fs.existsSync(filename)).toBe(false);
        expect(memfs.existsSync(filename)).toBe(true);
        memfs.rmSync(filename);
    });
});

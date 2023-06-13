import { describe, it, expect } from 'vitest';
import { camelCase } from '../../src/utils/string-utils';

describe('camelCase', () => {
    it('should remove any non-alphanumerical character, and make next letter captital', () => {
        expect(camelCase('get-more')).toBe('getMore');
        expect(camelCase('get_more')).toBe('getMore');
        expect(camelCase('get/more')).toBe('getMore');
    });

    it('should replace multiple instances of non-alphanumerical characters', () => {
        expect(camelCase('get-more-than-others')).toBe('getMoreThanOthers');
    });
});

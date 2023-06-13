import { describe, it, expect } from 'vitest';
import * as SetUtils from '../../src/utils/set-utils';
import { difference } from '../../src/utils/set-utils';

describe('setutils', () => {
    describe('union', () => {
        it('should add sets together', () => {
            expect(SetUtils.union(new Set([1, 2, 3]), new Set([3, 4, 5, 6]))).toEqual(new Set([1, 2, 3, 4, 5, 6]));

            expect(SetUtils.union(new Set([1, 2, 3]), new Set())).toEqual(new Set([1, 2, 3]));
        });
    });
    describe('intersection', () => {
        it('should only keep values present in both sets', () => {
            expect(SetUtils.intersection(new Set([1, 2, 3]), new Set([3, 4, 5, 6]))).toEqual(new Set([3]));

            expect(SetUtils.intersection(new Set([1, 2, 3]), new Set([4, 5, 6]))).toEqual(new Set([]));
        });
    });
    describe('difference', () => {
        it('should substract second set from first', () => {
            expect(SetUtils.difference(new Set([1, 2, 3]), new Set([4, 5, 6]))).toEqual(new Set([1, 2, 3]));

            expect(SetUtils.difference(new Set([1, 2, 3]), new Set([2, 3, 4, 5, 6]))).toEqual(new Set([1]));
        });
    });
});

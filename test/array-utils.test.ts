import { describe, it, expect } from 'vitest';
import { groupBy } from '../src/utils/array-utils';

const createDummy = (value: any) => ({ id: value.toString(), name: `name_${value.toString()}` });

describe('groupBy', () => {
    it('should use array-value as default valute-extractor', () => {
        const dummyObjects = new Array(5).fill(0).map((_, i) => createDummy(i));
        const byId = dummyObjects.reduce(
            groupBy(({ id }) => id),
            {},
        );

        expect(Object.values(byId)).toEqual(dummyObjects.map((it) => [it]));
    });

    it('should respect custom value selector', () => {
        const dummyObjects = new Array(5).fill(0).map((_, i) => createDummy(i));
        const byId = dummyObjects.reduce(
            groupBy(
                ({ id }) => id,
                ({ name }) => name,
            ),
            {},
        );

        expect(Object.values(byId)).toEqual(dummyObjects.map((it) => [it.name]));
    });

    it('should group elements with similar keys', () => {
        const dummyObjects = new Array(5).fill(0).map((_, i) => createDummy(i));
        const byId = dummyObjects.reduce(
            groupBy(
                ({ id }) => '1' as string,
                ({ name }) => name,
            ),
            {},
        );

        expect(byId['1']).toEqual(dummyObjects.map((it) => it.name));
    });
});

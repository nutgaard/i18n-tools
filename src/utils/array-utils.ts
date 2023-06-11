export function groupBy<TData, TKey extends string | number, TValue = TData>(
    keyExtract: (t: TData) => TKey,
    valueExtract: (t: TData) => TValue = (it) => it as unknown as TValue,
): (acc: Record<TKey, TValue[]>, element: TData) => Record<TKey, TValue[]> {
    return (acc, element) => {
        const key = keyExtract(element);
        const group = acc[key] ?? [];
        group.push(valueExtract(element));
        acc[key] = group;
        return acc;
    };
}

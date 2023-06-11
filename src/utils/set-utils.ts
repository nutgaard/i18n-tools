export function union<TData>(first: Set<TData>, second: Set<TData>): Set<TData> {
    // @ts-ignore
    return new Set<TData>([...first, ...second]);
}

export function intersection<TData>(first: Set<TData>, second: Set<TData>): Set<TData> {
    // @ts-ignore
    return new Set([...first].filter((it) => second.has(it)));
}

export function difference<TData>(first: Set<TData>, second: Set<TData>): Set<TData> {
    // @ts-ignore
    return new Set([...first].filter((it) => !second.has(it)));
}

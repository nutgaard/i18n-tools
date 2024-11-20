import { Format } from '../config';
import { getFilesystem } from './get-filesystem';

export function splitBundleIntoFiles(bundleFile: string, format: Format): TextEntry[] {
    const content = getFilesystem().readFileSync(bundleFile, 'utf-8').toString();
    const bundle = JSON.parse(content);

    const parser = formatParsers[format];
    return visitNodes(bundle).map(parser);
}

export type TextEntry = {
    path: string[];
    content: string;
};

const formatParsers: Record<Format, (entry: TextEntry) => TextEntry> = {
    json({ path, content }: TextEntry) {
        return {
            path: path.flatMap((it) => it.split('/')),
            content,
        };
    },
    jsonlut(entry: TextEntry) {
        return entry;
    },
    formatjs({ path, content }: TextEntry) {
        return {
            path: path.flatMap((it) => it.split('/')).slice(0, -1),
            content,
        };
    },
    script(entry: TextEntry) {
        throw new Error('Unsupported format for parsing bundle');
    },
};

function visitNodes(content: any, path: string[] = [], accumulator: TextEntry[] = []): TextEntry[] {
    if (typeof content === 'string') {
        accumulator.push({ path, content });
        return accumulator;
    }

    const entries = Object.entries(content);
    for (const [key, value] of entries) {
        visitNodes(value, [...path, key], accumulator);
    }

    return accumulator;
}

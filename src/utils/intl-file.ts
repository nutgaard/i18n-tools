import * as pathUtils from 'path';
import * as fs from 'fs';
import { camelCase } from './utils';

const languagePattern = /_([^\W_]+)\.\w+$/;
const removeLanguagePattern = /(?:_[^\W_]+)?\.\w+$/;

function findLocale(path: string): string {
    const match = languagePattern.exec(path);
    if (match) {
        return match[1];
    }
    return 'nb';
}

function findKey(path: string): string {
    return path.replace(removeLanguagePattern, '');
}

export class IntlFile {
    private path: string;
    readonly textId: string;
    readonly shortTextId: string;
    readonly content: string;
    readonly locale: string;

    static of(path: string, relativeTo: string): IntlFile {
        return new IntlFile(path, relativeTo);
    }

    private constructor(path: string, relativeTo: string) {
        this.path = pathUtils.relative(relativeTo, path).replace('./', '');
        this.locale = findLocale(this.path);
        this.textId = findKey(findKey(this.path)).replace('./', '');
        this.shortTextId = camelCase(findKey(pathUtils.basename(this.path))).replace('./', '');
        this.content = fs.readFileSync(path, 'utf-8');
    }

    getPathParts(): string[] {
        return pathUtils
            .dirname(this.path)
            .split('/')
            .filter((it) => it !== '.');
    }
}

import * as fs from 'fs';
import memfs, { IFs } from 'memfs';

export function getMemFs(): IFs {
    return memfs.fs;
}
export function getFs(): IFs {
    return fs as unknown as IFs;
}

export function getFilesystem(): IFs {
    if (process.env.NODE_ENV === 'test') {
        return getMemFs();
    } else {
        return getFs();
    }
}

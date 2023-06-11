import * as fs from 'node:fs';
import * as path from 'node:path';

export function getAllFiles(directory: string): string[] {
    return fs.readdirSync(directory).flatMap((file) => {
        const fullPath = path.join(directory, file);
        const isDirectory = fs.lstatSync(fullPath).isDirectory();
        if (isDirectory) {
            return getAllFiles(fullPath);
        }
        return [fullPath];
    });
}

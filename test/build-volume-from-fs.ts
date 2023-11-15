import fs from 'fs';
import path from 'path';
import { NestedDirectoryJSON } from 'memfs/lib/volume';

export function buildVolumeFromFs(directory: string): NestedDirectoryJSON {
    const directoryJson: NestedDirectoryJSON = {};

    walkDirectory(directory, (file) => {
        const relativeFilePath = path.relative(directory, file);
        const parts = relativeFilePath.split(path.sep);

        let jsonObject: NestedDirectoryJSON = directoryJson;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;

            if (isLast) {
                jsonObject[part] = fs.readFileSync(file, 'utf-8');
            } else {
                jsonObject[part] = jsonObject[part] ?? {};
                jsonObject = jsonObject[part] as NestedDirectoryJSON;
            }
        }
    });

    return directoryJson;
}

function walkDirectory(directory: string, callback: (file: string) => void) {
    fs.readdirSync(directory).forEach((file) => {
        const dirPath = path.join(directory, file);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDirectory(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

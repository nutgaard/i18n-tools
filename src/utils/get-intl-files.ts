import { IntlFile } from './intl-file';
import { getAllFiles } from './io-utils';

const filePattern = /_[\w_]+\.(?:txt|html|md)$/;
export function getIntlFiles(directory: string): IntlFile[] {
    return getAllFiles(directory)
        .filter((file) => filePattern.test(file))
        .map((file) => IntlFile.of(file, directory));
}

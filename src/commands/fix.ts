import path from 'path';
import { Logger } from 'types';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';
import { getFilesystem } from '../utils/get-filesystem';
import { FixOptions } from '../config';

export default class Fix {
    static async run(logger: Logger, config: FixOptions) {
        const files = getIntlFiles(config.srcDir);
        const result = validateStructure(files);
        if (!result.error) {
            console.log('No errors found');
            process.exit(0);
        }
        result.printLogs();
        console.log('Attempting to fix errors...');

        const filecreated = new Set();
        for (const error of result.errors) {
            const filename = path.join(config.srcDir, `${error.missingKey}_${error.locale}.txt`);
            if (filecreated.has(filename)) continue;
            filecreated.add(filename);

            console.log(`Creating '${filename}'`);
            getFilesystem().writeFileSync(filename, `[${error.locale}] TODO`, { encoding: 'utf-8' });
        }
    }
}

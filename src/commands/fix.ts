import fs from 'fs';
import path from 'path';
import { Config } from '../config';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';

export default class Fix {
    static async run(config: Config) {
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
            fs.writeFileSync(filename, `[${error.locale}] TODO`, 'utf-8');
        }
    }
}
import { Config } from '../config';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';

export default class Validate {
    static async run(config: Config) {
        const files = getIntlFiles(config.srcDir);
        const { error, printLogs } = validateStructure(files);
        if (error) {
            printLogs();
            process.exit(1);
        } else {
            console.log('No errors found');
            process.exit(0);
        }
    }
}

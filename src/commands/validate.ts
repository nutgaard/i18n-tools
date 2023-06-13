import { Logger } from 'types';
import { ValidateOptions } from '../config';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';

export default class Validate {
    static async run(logger: Logger, config: ValidateOptions) {
        const files = getIntlFiles(config.srcDir);
        const { error, printLogs } = validateStructure(files);
        if (error) {
            printLogs();
            throw new Error();
        } else {
            console.log('No errors found');
        }
    }
}

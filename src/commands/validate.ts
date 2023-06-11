import { Config } from '../config';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';

export default class Validate {
    static async run(config: Config) {
        const files = getIntlFiles(config.srcDir);
        validateStructure(files);
    }
}

import { compileAndWrite } from '@formatjs/cli-lib';
import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../config';
import { createMessageBundle, IntlLocaleBundle } from '../builder/create-message-bundle';
import { compileIntlTextBundles } from '../builder/compile-intl-text-bundles';
import { compileIntlLutBundle } from '../builder/compile-intl-lut-bundle';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';
import * as process from 'process';

interface BuildConfig extends Config {
    exitOnError?: boolean;
}

export default class Build {
    static async run(config: BuildConfig) {
        const files = getIntlFiles(config.srcDir);
        if (config.validate) {
            const { error, printLogs } = validateStructure(files);
            if (error) {
                printLogs();
                if (config.exitOnError ?? true) {
                    process.exit(1);
                }
            }
        }

        if (!fs.existsSync(config.outDir)) {
            fs.mkdirSync(config.outDir);
        }

        if (config.lut) {
            const filename = config.typescript ? 'lut.ts' : 'lut.js';
            const bundle: IntlLocaleBundle = createMessageBundle(files);
            const lut = compileIntlLutBundle(Object.values(bundle)[0], config.typescript); // TODO fix
            fs.writeFileSync(path.join(config.outDir, filename), lut, 'utf-8');
        }

        const compiled = compileIntlTextBundles(files, config.bundleFormat);
        const bundleFileExt = config.bundleFormat === 'script' ? (config.typescript ? 'ts' : 'js') : 'json';
        for (const [locale, content] of compiled) {
            const filename = path.join(config.outDir, `bundle_${locale}.${bundleFileExt}`);
            fs.writeFileSync(filename, content, 'utf-8');

            if (config.ast) {
                await compileAndWrite([filename], {
                    ast: true,
                    outFile: path.join(config.outDir, `bundle_${locale}.compiled.json`),
                });
            }
        }
    }
}

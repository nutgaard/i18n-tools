import * as path from 'path';
import { Config } from '../config';
import { createMessageBundle, IntlLocaleBundle } from '../builder/create-message-bundle';
import { compileIntlTextBundles } from '../builder/compile-intl-text-bundles';
import { compileIntlLutBundle } from '../builder/compile-intl-lut-bundle';
import { getIntlFiles } from '../utils/get-intl-files';
import { validateStructure } from '../validator/validate';
import * as process from 'process';
import { getFilesystem } from '../utils/get-filesystem';
import { compile } from '../builder/compile-formatjs-bundle';

interface BuildConfig extends Config {
    exitOnError?: boolean;
    hasFixerListener?: boolean;
}

export default class Build {
    static async run(config: BuildConfig) {
        const files = getIntlFiles(config.srcDir);
        const fs = getFilesystem();
        if (config.validate) {
            const { error, printLogs } = validateStructure(files, config.hasFixerListener ?? false);
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
            fs.writeFileSync(path.join(config.outDir, filename), lut, { encoding: 'utf-8' });
        }

        const compiled = compileIntlTextBundles(files, config.bundleFormat);
        const bundleFileExt = config.bundleFormat === 'script' ? (config.typescript ? 'ts' : 'js') : 'json';
        for (const [locale, content] of compiled) {
            const filename = path.join(config.outDir, `bundle_${locale}.${bundleFileExt}`);
            fs.writeFileSync(filename, content, { encoding: 'utf-8' });

            if (config.ast) {
                const compiledFilename = path.join(config.outDir, `bundle_${locale}.compiled.json`);
                const compiledBundle = await compile([filename], {
                    ast: true,
                });
                fs.writeFileSync(compiledFilename, compiledBundle, { encoding: 'utf-8' });
            }
        }
    }
}

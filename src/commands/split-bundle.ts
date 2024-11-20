import { Command, program } from 'commander';
import { Format } from '../config';
import { splitBundleIntoFiles, TextEntry } from '../utils/split-bundle';
import { findLocale } from '../utils/intl-file';
import { getFilesystem } from '../utils/get-filesystem';
import * as pathUtils from 'path';

interface BuildOptions {
    format: Format;
}

const validSplitFormats: Format[] = ['json', 'jsonlut', 'formatjs'];

export const splitBundleCommand: Command = program
    .createCommand('split')
    .description('Split bundle files into separate i18n files')
    .argument('<bundleFile>', 'bundle file containing all i18n texts')
    .argument('<outDir>', 'output folder for your i18n texts')
    .addOption(
        program.createOption('-f, --format <format>', 'Output format').choices(validSplitFormats).default('formatjs'),
    )
    .addHelpText('afterAll', '\n')
    .addHelpText('afterAll', 'Example: i18n-tool split example/compiled/bundle_en.json example/messages')
    .action(runSplitCommand);

export async function runSplitCommand(bundleFile: string, outDir: string, config: BuildOptions) {
    const locale = findLocale(bundleFile);
    const files = splitBundleIntoFiles(bundleFile, config.format);

    files.forEach((it) => writeEntry(outDir, locale, it));
}

function writeEntry(outDir: string, locale: string, { path, content }: TextEntry) {
    const fs = getFilesystem();
    const filename = path.pop()!;

    const fullpath = pathUtils.join(pathUtils.resolve(outDir, pathUtils.join(...path)), `${filename}_${locale}.txt`);

    const dirname = pathUtils.dirname(fullpath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(fullpath, content, { encoding: 'utf-8' });
}

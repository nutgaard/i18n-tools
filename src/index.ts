import { program } from '@caporal/core';
import BuildCmd from './commands/build';
import WatchCmd from './commands/watch';
import ValidateCmd from './commands/validate';
import FixCmd from './commands/fix';
import { BuildOptions, FixOptions, ValidateOptions, WatchOptions, validFormats } from './config';

program.name('i18n-tool').bin('i18n-tool').description('Utility for building and compiling I18N bundles');

program
    .command('build', 'Bundles files in <srcDir> into i18n files')
    .argument('<srcDir>', 'source folder of your i18n files')
    .argument('<outDir>', 'output folder for your i18n bundles')
    .option('-f, --format <format>', 'Output format', { default: 'formatjs', validator: validFormats })
    .option('--typescript', 'Output script files with typescript', { default: false })
    .option('--strict', 'Run validation before bundling', { default: false })
    .option('--ast', 'Compile generated bundles (only availble with formatjs)', { default: false })
    .option('--lut', 'Generate look-up-table', { default: false })
    .option('-t, --timeZone <timezone>', 'Inject timezone into date/time skeletons')
    .action(({ logger, args, options }) => {
        BuildCmd.run(logger, { ...args, ...options } as unknown as BuildOptions);
    });

program
    .command('watch', 'Starts watching and rebundling files in <srcDir> into i18n files')
    .argument('<srcDir>', 'source folder of your i18n files')
    .argument('<outDir>', 'output folder for your i18n bundles')
    .option('-f, --format <format>', 'Output format', { default: 'formatjs', validator: validFormats })
    .option('--typescript', 'Output script files with typescript', { default: false })
    .option('--strict', 'Run validation before bundling', { default: false })
    .option('--ast', 'Compile generated bundles (only availble with formatjs)', { default: false })
    .option('--lut', 'Generate look-up-table', { default: false })
    .option('-t, --timeZone <timezone>', 'Inject timezone into date/time skeletons')
    .action(({ logger, args, options }) => {
        WatchCmd.run(logger, { ...args, ...options } as unknown as WatchOptions);
    });

program
    .command('validate', 'Validate that every locale contains the same set of keys')
    .argument('<srcDir>', 'source folder of your i18n files')
    .action(({ logger, args, options }) => {
        ValidateCmd.run(logger, { ...args, ...options } as unknown as ValidateOptions);
    });

program
    .command('fix', 'Attempts to fix validation issues by creating missing files')
    .argument('<srcDir>', 'source folder of your i18n files')
    .action(({ logger, args, options }) => {
        FixCmd.run(logger, { ...args, ...options } as unknown as FixOptions, true);
    });

program.run();

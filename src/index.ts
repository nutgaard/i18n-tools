import { program } from 'commander';
import { buildCommand } from './commands/build';
import { watchCommand } from './commands/watch';
import { validateCommand } from './commands/validate';
import { fixCommand } from './commands/fix';

program
    .name('i18n-tool')
    .description('Utility for building and compiling I18N bundles')
    .addCommand(buildCommand)
    .addCommand(watchCommand)
    .addCommand(validateCommand)
    .addCommand(fixCommand)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse();

import { Config } from './config';
import { readArgs } from './utils/read-args';
import BuildCmd from './commands/build';
import WatchCmd from './commands/watch';
import HelpCmd from './commands/help';
import ValidateCmd from './commands/validate';
import FixCmd from './commands/fix';

const [runtime, script, ...args] = process.argv;
const config: Config = readArgs(args);

(async () => {
    if (config.command === 'build') {
        await BuildCmd.run(config);
    } else if (config.command === 'watch') {
        await WatchCmd.run(config);
    } else if (config.command === 'validate') {
        await ValidateCmd.run(config);
    } else if (config.command === 'fix') {
        await FixCmd.run(config);
    } else {
        await HelpCmd.run(config);
    }
})();

import * as readline from 'readline';
import * as chokidar from 'chokidar';
import { Logger } from 'types';
import { WatchOptions } from '../config';
import Build from './build';
import Fix from './fix';

interface Key {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}

export default class Watch {
    static async run(logger: Logger, config: WatchOptions) {
        const watcher = chokidar.watch(config.srcDir, { ignoreInitial: true });
        const buildConfig = { ...config, exitOnError: false, hasFixerListener: true };

        await Build.run(logger, buildConfig);
        logger.info('Initial I18N-bundles created');
        watcher.on('all', (...args) => {
            logger.info('Recompiling I18N-bundles');
            Build.run(logger, buildConfig);
            logger.info('Recompiled I18N-bundles');
        });

        readline.emitKeypressEvents(process.stdin);
        process.stdin.on('keypress', (ch: string, key: Key) => {
            if (key.ctrl && key.name === 'c') process.exit(0);
            if (key.name === 'f') {
                Fix.run(logger, config);
            }
        });
        process.stdin.setRawMode(true);
    }
}

import { Config } from '../config';
import * as chokidar from 'chokidar';
import Build from './build';

export default class Watch {
    static async run(config: Config) {
        const watcher = chokidar.watch(config.srcDir, { ignoreInitial: true });
        const buildConfig = { ...config, exitOnError: false };

        await Build.run(buildConfig);
        console.log('Initial I18N-bundles created');
        watcher.on('all', () => {
            console.log('Recompiling I18N-bundles');
            Build.run(buildConfig);
            console.log('Recompiled I18N-bundles');
        });
    }
}

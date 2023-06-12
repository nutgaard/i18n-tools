import { Config, defaultConfig, Format } from '../config';

const outdirRequired = ['build', 'watch', 'fix'];
export function readArgs(args: string[]): Config {
    const [command, srcDir, ...restArgs] = args;
    const outDir = outdirRequired.includes(command) ? restArgs[0] : '';
    const options = outdirRequired.includes(command) ? restArgs.slice(1) : restArgs;
    const config = { ...defaultConfig, command, srcDir, outDir };

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const value = options[i + 1];
        switch (option) {
            case '--format':
            case '-f':
                config.bundleFormat = isValidFormat(value) ? value : 'formatjs';
                break;
            case '--typescript':
                config.typescript = true;
                break;
            case '--strict':
                config.validate = true;
                break;
            case '--ast':
                config.ast = true;
                break;
            case '--lut':
                config.lut = true;
                break;
        }
    }

    if (config.ast && config.bundleFormat !== 'formatjs') {
        console.error(`Cannot compile output formats other than 'formatjs'`);
        process.exit(1);
    }
    return config;
}

function isValidFormat(value: string): value is Format {
    return ['script', 'json', 'formatjs'].includes(value);
}

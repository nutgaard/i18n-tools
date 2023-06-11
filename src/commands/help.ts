import { Config } from '../config';

export default class Help {
    static async run(config: Config) {
        console.log(
            `
Utility for building and compiling I18N bundles

i18n-tool build <srcDir> <outDir> [...options]
i18n-tool watch <srcDir> <outDir> [...options]
i18n-tool validate <srcDir>
i18n-tool help

Options:
    -f, --format:   Output format; script, json, formatjs
                    Default: formatjs
    
    --typescript:   Output (if not json format) should be typescript
                    Default: false
    
    --strict        Run validation when building bundles.
                    Default: false
    
    --ast           Generated compiled bundles
                    Default: false
                    
    --lut           Generated look-up-table
                    Default: false
`.trim(),
        );
    }
}

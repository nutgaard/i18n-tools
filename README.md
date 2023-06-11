# I18N-tools

Utility for building and compiling I18N bundles.

The project uses tools from [FormatJS](https://formatjs.io/), if your project uses other tools it may not work for you.

**Install globally:**
`npm install @nutgaard/i18n-tools -g`

**Install in project:**
`npm install @nutgaard/i18n-tools --save-dev`

**How to use it:**
```
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
```



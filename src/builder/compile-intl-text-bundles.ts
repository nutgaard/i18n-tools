import { IntlFile } from '../utils/intl-file';
import { Format } from '../config';

interface IntlTextBundles {
    [key: string]: IntlTextBundle;
}
interface IntlTextBundle {
    [key: string]: string;
}

type Formatter = (content: IntlTextBundle) => string;
const formatMap: Record<Format, Formatter> = {
    json: jsonFormatter,
    script: scriptFormatter,
    formatjs: formatjsFormatter,
};

export function compileIntlTextBundles(files: IntlFile[], format: Format): [string, string][] {
    const bundle = createTextBundle(files);
    const formatter: Formatter = formatMap[format];
    return Object.entries(bundle).map(([locale, content]) => [locale, formatter(content)]);
}

function jsonFormatter(content: IntlTextBundle): string {
    return JSON.stringify(content, null, 2);
}
function scriptFormatter(content: IntlTextBundle): string {
    return `const texts = ${jsonFormatter(content)};\n\nexport default texts;`;
}
function formatjsFormatter(content: IntlTextBundle): string {
    const reformattedContent = Object.fromEntries(
        Object.entries(content).map(([key, value]) => [key, { defaultMessage: value }]),
    );
    return JSON.stringify(reformattedContent, null, 2);
}

function createTextBundle(files: IntlFile[]): IntlTextBundles {
    return files.reduce((acc, file) => {
        const locale = file.locale;
        const key = file.textId;
        const content = file.content;

        const localeGroup = (acc[locale] ?? {}) as IntlTextBundle;
        localeGroup[key] = content;
        acc[locale] = localeGroup;
        return acc;
    }, {} as IntlTextBundles);
}

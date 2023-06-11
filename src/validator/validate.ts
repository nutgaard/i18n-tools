import { IntlFile } from '../utils/intl-file';
import { groupBy } from '../utils/array-utils';
import * as SetUtils from '../utils/set-utils';
import * as process from 'process';

export interface ValidationResult {
    error: boolean;
    printLogs: () => void;
}

export function validateStructure(files: IntlFile[]): ValidationResult {
    const byLocale = files.reduce(
        groupBy(
            (file) => file.locale,
            (file) => file.textId,
        ),
        {},
    );
    const [primaryLocale, primaryLocaleTextIds] = Object.entries(byLocale).at(0)!;
    const mandatoryTextsIds: Set<string> = new Set(primaryLocaleTextIds);

    let errorFound = false;
    const logs: Array<() => void> = [];

    for (const [locale, textIds] of Object.entries(byLocale)) {
        if (locale === primaryLocale) continue;

        const localeSet = new Set<string>(textIds);
        const missingMandatoryIds = SetUtils.difference(mandatoryTextsIds, localeSet);
        const extraIds = SetUtils.difference(localeSet, mandatoryTextsIds);

        if (missingMandatoryIds.size > 0) {
            logs.push(() =>
                console.error(`Locale '${locale}' is missing ${missingMandatoryIds.size} from '${primaryLocale}'.`),
            );
            logs.push(() =>
                console.log(
                    Array.from(missingMandatoryIds)
                        .map((it) => `\t${it}`)
                        .join('\n'),
                ),
            );
        }
        if (extraIds.size > 0) {
            logs.push(() =>
                console.error(`Locale '${locale}' contains ${extraIds.size} texts more then '${primaryLocale}'.`),
            );
            logs.push(() =>
                console.log(
                    Array.from(extraIds)
                        .map((it) => `\t${it}`)
                        .join('\n'),
                ),
            );
        }

        errorFound = errorFound || missingMandatoryIds.size > 0 || extraIds.size > 0;
    }

    return {
        error: errorFound,
        printLogs() {
            logs.forEach((logLine) => logLine());
        },
    };
}

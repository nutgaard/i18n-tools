/**
 * Source taken from https://github.com/formatjs/formatjs/blob/main/packages/cli-lib/src/compile.ts
 * in order to support memfs
 */
import { Opts } from '@formatjs/cli-lib/src/compile';
import { resolveBuiltinFormatter } from '@formatjs/cli-lib/src/formatters';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser/types';
import { parse } from '@formatjs/icu-messageformat-parser';
import stringify from 'json-stable-stringify';
import { getFilesystem } from '../utils/get-filesystem';

export async function compile(inputFiles: string[], opts: Opts = {}): Promise<string> {
    const fs = getFilesystem();
    const { ast, format, skipErrors } = opts;
    const formatter = await resolveBuiltinFormatter(format);

    const messages: Record<string, string> = {};
    const messageAsts: Record<string, MessageFormatElement[]> = {};
    const idsWithFileName: Record<string, string> = {};
    const filecompiler = inputFiles.map((file) =>
        fs.promises
            .readFile(file, { encoding: 'utf-8' })
            .then((content) => JSON.parse(content.toString()))
            .then(formatter.compile),
    );
    const compiledFiles = await Promise.all(filecompiler);
    for (let i = 0; i < inputFiles.length; i++) {
        const inputFile = inputFiles[i];
        const compiled = compiledFiles[i];
        for (const id in compiled) {
            if (messages[id] && messages[id] !== compiled[id]) {
                throw new Error(`Conflicting ID "${id}" with different translation found in these 2 files:
ID: ${id}
Message from ${idsWithFileName[id]}: ${messages[id]}
Message from ${inputFile}: ${compiled[id]}
`);
            }
            try {
                const msgAst = parse(compiled[id]);
                messages[id] = compiled[id];
                messageAsts[id] = msgAst;
                idsWithFileName[id] = inputFile;
            } catch (e) {
                console.warn('Error validating message "%s" with ID "%s" in file "%s"', compiled[id], id, inputFile);
                if (!skipErrors) {
                    throw e;
                }
            }
        }
    }

    return stringify(ast ? messageAsts : messages, {
        space: 2,
        cmp: formatter.compareMessages || undefined,
    });
}

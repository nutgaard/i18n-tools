import {
    MessageFormatElement,
    isLiteralElement,
    isSelectElement,
    isPluralElement,
    isPoundElement,
    isTagElement,
    TYPE,
} from '@formatjs/icu-messageformat-parser';

export interface VariableDescription {
    name: string;
    type: TYPE;
    options?: string[];
}

export function extractVariablesFromAST(ast: MessageFormatElement[]): VariableDescription[] {
    let stack: MessageFormatElement[] = ast.slice().reverse();
    const params: VariableDescription[] = [];
    const used = new Set();
    while (stack.length) {
        const element: MessageFormatElement | undefined = stack.pop();

        if (element === undefined) continue;
        else if (isLiteralElement(element)) continue;
        else if (isPoundElement(element)) continue;

        const description: VariableDescription = {
            name: element.value,
            type: element.type,
        };
        if (!used.has(description.name)) params.push(description);
        used.add(description.name);

        let children: MessageFormatElement[] = [];
        if (isSelectElement(element)) {
            children = Object.values(element.options).flatMap((it) => it.value);
            description.options = Object.keys(element.options);
        } else if (isPluralElement(element)) {
            children = Object.values(element.options).flatMap((it) => it.value);
        } else if (isTagElement(element)) {
            children = element.children;
        }

        if (children.length > 0) {
            stack = stack.concat(children);
        }
    }

    return params;
}

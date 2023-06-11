export function camelCase(str: string): string {
    return str.replace(/[\W_]+(\w)?/g, (_, ch: string) => (ch ? ch.toUpperCase() : ''));
}

export function toTitleCase(text: string): string {
    return text
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

export function nullOrZero(n: number | undefined | null, def: number): number {
    if (n == null || n <= 0) n = def;
    return n;
}

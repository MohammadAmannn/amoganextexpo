export function cn(...values: Array<string | false | null | undefined>) { return values.filter(Boolean).join(' ') }
export function invariant(value: unknown, message: string): asserts value { if (!value) throw new Error(message) }

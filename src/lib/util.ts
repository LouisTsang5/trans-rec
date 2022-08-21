export function hasKey<T>(object: T, key: PropertyKey): key is keyof object {
    return key in object;
}

export function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
}
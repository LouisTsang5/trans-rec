export function hasKey<T>(object: T, key: PropertyKey): key is keyof object {
    return key in object;
}

export function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
}

export function immutableMove<T>(arr: T[], fromIndex: number, toIndex: number) {
    const newArr: T[] = [];
    const targetItem = arr[fromIndex];

    if (toIndex === -1) newArr.push(targetItem);
    arr.forEach((item, index) => {
        newArr.push(item);
        if (index === toIndex) newArr.push(targetItem);
    });

    const removeIndex = toIndex < fromIndex ? fromIndex + 1 : fromIndex;
    newArr.splice(removeIndex, 1);
    return newArr;
}
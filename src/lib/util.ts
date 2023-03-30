export function hasKey<T extends object>(object: T, key: PropertyKey): key is keyof object {
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

export function scrollParentToChild(parent: HTMLElement, child: HTMLElement) {
    const parentRect = parent.getBoundingClientRect();
    const parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth
    };
    const childRect = child.getBoundingClientRect();
    const isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);
    if (!isViewable) {
        const scrollTop = childRect.top - parentRect.top;
        const scrollBot = childRect.bottom - parentRect.bottom;
        if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
            parent.scrollTop += scrollTop;
        } else {
            parent.scrollTop += scrollBot;
        }
    }

}

export const getLastMonth = () => {
    const cur = new Date();
    const start = new Date(cur.getFullYear(), cur.getMonth() - 1, 1);
    const end = new Date(cur.getFullYear(), cur.getMonth(), 0);
    return { start, end };
};

export const getMonthToDate = () => {
    const cur = new Date();
    const start = new Date(cur.getFullYear(), cur.getMonth(), 1);
    return { start, end: cur };
};

export const toYyyyMmDd = (date: Date) => {
    return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
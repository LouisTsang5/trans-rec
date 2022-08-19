export const transactionTypeDisplayMap: TransactionTypeDisplayMap = {
    d: 'Deposit',
    w: 'Withdrawal'
};

export function getTransactionType(str: string): TransactionType {
    const type = Object.entries(transactionTypeDisplayMap).find(([, displayStr]) => displayStr === str)?.[0];
    if (!type) throw new Error('Incorrect Transaction Value');
    return type as TransactionType;
}

export function getDisplayName(key: TransactionType): string {
    if (Object.prototype.hasOwnProperty.call(transactionTypeDisplayMap, key)) return transactionTypeDisplayMap[key as keyof typeof transactionTypeDisplayMap];
    throw new Error('Incorrect Transaction Type');
}
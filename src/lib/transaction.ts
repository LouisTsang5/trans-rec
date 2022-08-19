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

export function calculateBalance(transactions: TransactionData[]) {
    if (transactions.length === 0) return 0;
    return transactions
        .map(transaction => transaction.type === 'd' ? transaction.amount : -transaction.amount)
        .reduce((acc, cur) => acc + cur);
}
type ParsedTransactionData = {
    amount: number,
    date: string,
    description: string,
    id: string,
    type: TransactionType
}

const key = 'transactionList';

export function storeList(list: TransactionData[]) {
    localStorage.setItem(key, JSON.stringify(list));
}

export function loadList(): TransactionData[] | undefined {
    const str = localStorage.getItem(key);
    const parsedData = str ? JSON.parse(str) as ParsedTransactionData[] : undefined;
    return parsedData?.map(pData => ({
        amount: pData.amount,
        date: new Date(pData.date),
        description: pData.description,
        id: pData.id,
        type: pData.type,
    } as TransactionData));
}
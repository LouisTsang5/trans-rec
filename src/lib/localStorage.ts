import { transactionTypeDisplayMap } from './transaction';
import { hasKey, isValidDate } from './util';

type ParsedTransactionData = {
    amount: number,
    date: string,
    description: string,
    id: string,
    type: TransactionType
}

const key = 'transactionList';

function toTransactionData(parsedData: ParsedTransactionData): TransactionData {
    return {
        amount: parsedData.amount,
        date: new Date(parsedData.date),
        description: parsedData.description,
        id: parsedData.id,
        type: parsedData.type,
    };
}

function isValidTransaction(data: unknown): data is ParsedTransactionData {
    if (!data || typeof data !== 'object') return false;

    //Check date
    const dateKey = 'date';
    if (
        !hasKey(data, dateKey) ||
        typeof data[dateKey] !== 'string' ||
        !isValidDate(new Date(data[dateKey]))
    ) return false;

    //Check amount
    const amtKey = 'amount';
    if (
        !hasKey(data, amtKey) ||
        typeof data[amtKey] !== 'number'
    ) return false;

    //Check description
    const descKey = 'description';
    if (
        !hasKey(data, descKey) ||
        typeof data[descKey] !== 'string'
    ) return false;

    //Check id
    const idKey = 'id';
    if (
        !hasKey(data, idKey) ||
        typeof data[idKey] !== 'string'
    ) return false;

    //Check type
    const typeKey = 'type';
    if (
        !hasKey(data, typeKey) ||
        typeof data[typeKey] !== 'string' ||
        !Object.keys(transactionTypeDisplayMap).includes(data[typeKey])
    ) return false;

    return true;
}

export function storeList(list: TransactionData[]) {
    localStorage.setItem(key, JSON.stringify(list));
}

export function loadList(): TransactionData[] | undefined {
    const str = localStorage.getItem(key);
    const parsedData = str ? JSON.parse(str) as ParsedTransactionData[] : undefined;
    return parsedData?.map(pData => toTransactionData(pData));
}

export function parseData(dataStr: string): TransactionData[] {
    const data = JSON.parse(dataStr);
    if (!Array.isArray(data)) throw new Error('Incorrect save format');
    const list = data.map(item => {
        if (!isValidTransaction(item)) throw new Error('Incorrect save format');
        return toTransactionData(item);
    });
    return list;
}
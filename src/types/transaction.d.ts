type TransactionType = 'd' | 'w';

type TransactionTypeDisplayMap = {
    [key in TransactionType]: string
}

type TransactionData = {
    id: string,
    date: Date,
    description: string,
    type: TransactionType,
    amount: number
}

type UpdatedTransactionData = Omit<TransactionData, 'id'>;
import { useState } from 'react';
import TransactionInput from './components/transactionInput';
import TransactionList from './components/transactionList';

const startList: TransactionData[] = [];

export default function App() {
    const [transactionList, setTransactionList] = useState(startList);

    const removeTransaction = (id: string) => {
        const newList = transactionList.filter(data => data.id !== id);
        setTransactionList(newList);
    };

    return (
        <div>
            <h2>TransRec</h2>
            <TransactionInput
                onAddTransaction={(data) => setTransactionList(prev => [...prev, data])}
            />
            <TransactionList
                list={transactionList}
                onRemoveTransaction={removeTransaction}
            />
        </div>
    );
}
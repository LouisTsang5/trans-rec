import { useEffect, useState } from 'react';
import TransactionInput from './components/transactionInput';
import TransactionList from './components/transactionList';
import { loadList, storeList } from './lib/localStorage';

const startingList = loadList() ?? [];

export default function App() {
    const [transactionList, setTransactionList] = useState(startingList);

    useEffect(() => {
        storeList(transactionList);
    }, [transactionList]);

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
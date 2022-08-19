import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import TransactionInput from './components/transactionInput';
import TransactionList from './components/transactionList';
import { loadList, storeList } from './lib/localStorage';
import { calculateBalance } from './lib/transaction';

const startingList = loadList() ?? [];

const App: FunctionComponent = () => {
    const [transactionList, setTransactionList] = useState(startingList);
    const balance = useMemo(() => calculateBalance(transactionList), [transactionList]);

    //Store to local storage
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
            <span>Balance: {balance}</span>
        </div>
    );
};

export default App;
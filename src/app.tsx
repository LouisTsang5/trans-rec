import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import TransactionInput from './components/transactionInput/transactionInput';
import TransactionList from './components/transactionList/transactionList';
import { loadList, storeList } from './lib/localStorage';
import { calculateBalance } from './lib/transaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navBar';
import Balance from './components/balance';

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
            <NavBar />
            <div className='px-2'>
                <TransactionInput
                    onAddTransaction={(data) => setTransactionList(prev => [...prev, data])}
                />
                <TransactionList
                    list={transactionList}
                    onRemoveTransaction={removeTransaction}
                />
                <Balance balance={balance} />
            </div>
        </div>
    );
};

export default App;
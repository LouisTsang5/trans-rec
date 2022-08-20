import { FunctionComponent, useEffect, useState } from 'react';
import { loadList, storeList } from './lib/localStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navBar';
import Home from './pages/home';

const startingList = loadList() ?? [];

const App: FunctionComponent = () => {
    const [transactionList, setTransactionList] = useState(startingList);

    //Store to local storage
    useEffect(() => {
        storeList(transactionList);
    }, [transactionList]);

    const removeTransaction = (id: string) => {
        const newList = transactionList.filter(data => data.id !== id);
        setTransactionList(newList);
    };

    const addTransaction = (data: TransactionData) => {
        setTransactionList(prev => [...prev, data]);
    };

    return (
        <div>
            <NavBar />
            <div className='px-2'>
                <Home
                    transactionList={transactionList}
                    onAddTransaction={addTransaction}
                    onRemoveTransaction={removeTransaction}
                />
            </div>
        </div>
    );
};

export default App;
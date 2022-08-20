import { FunctionComponent, useEffect, useState } from 'react';
import { loadList, storeList } from './lib/localStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navBar';
import Home from './pages/home';
import { Route, Routes } from 'react-router-dom';
import Transaction from './components/transaction';

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

    const updateTransaction = (id: string, newData: UpdatedTransactionData) => {
        const transaction = transactionList.find(data => data.id === id);
        if (!transaction) throw new Error(`Cannot find transaction with id ${id}`);
        transaction.amount = newData.amount;
        transaction.date = newData.date;
        transaction.description = newData.description;
        transaction.type = newData.type;
        setTransactionList([...transactionList]);
    };

    return (
        <div>
            <NavBar />
            <div className='px-2'>
                <Routes>
                    <Route path='/' element={
                        <Home
                            transactionList={transactionList}
                            onAddTransaction={addTransaction}
                            onRemoveTransaction={removeTransaction}
                        />
                    } />
                    <Route path='transactions/:transactionId' element={<Transaction list={transactionList} onSave={updateTransaction} />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
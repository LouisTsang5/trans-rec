import { FunctionComponent, useEffect, useState } from 'react';
import { loadList, storeList } from './lib/localStorage';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navBar';
import Home from './pages/home';
import { Route, Routes } from 'react-router-dom';
import Transaction from './pages/transaction';
import Save from './pages/save';
import AllTransactions from './pages/allTransactions';
import { immutableMove } from './lib/util';
import Report from './pages/report';
import { Bus } from './pages/bus';

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

    const moveTransaction = (fromIndex: number, toIndex: number) => {
        const newList = immutableMove(transactionList, fromIndex, toIndex);
        setTransactionList(newList);
    };

    return (
        <div style={{ display: 'flex', flexFlow: 'column', height: '90vh' }}>
            <div style={{ flex: '0 1 auto' }}>
                <NavBar />
            </div>
            <div className='px-2' style={{ flex: '1 1 auto', overflow: 'scroll' }}>
                <Routes>
                    <Route path='/' element={
                        <Home
                            transactionList={transactionList}
                            onAddTransaction={addTransaction}
                            onRemoveTransaction={removeTransaction}
                        />
                    } />

                    <Route path='transactions' element={
                        <AllTransactions
                            list={transactionList}
                            onRearrange={moveTransaction}
                            onRemoveTransaction={removeTransaction} />
                    } />

                    <Route path='transactions/:transactionId' element={
                        <Transaction list={transactionList} onSave={updateTransaction} />
                    } />

                    <Route path='save' element={
                        <Save onUpload={setTransactionList} />
                    } />

                    <Route path='report' element={
                        <Report transactions={transactionList} />
                    } />

                    <Route path='bus/*' element={
                        <Bus />
                    } />
                </Routes>
            </div>
        </div>
    );
};

export default App;
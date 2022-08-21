import { FunctionComponent, useMemo } from 'react';
import Balance from '../components/balance';
import TransactionInput from '../components/transactionInput';
import TransactionList from '../components/transactionList/transactionList';
import { calculateBalance } from '../lib/transaction';

type HomeProps = {
    transactionList: TransactionData[],
    onAddTransaction: (data: TransactionData) => void,
    onRemoveTransaction: (id: string) => void,
}

const Home: FunctionComponent<HomeProps> = ({ transactionList, onAddTransaction, onRemoveTransaction }) => {
    const balance = useMemo(() => calculateBalance(transactionList), [transactionList]);
    return (
        <>
            <TransactionInput
                onAddTransaction={onAddTransaction}
            />
            <TransactionList
                list={transactionList}
                onRemoveTransaction={onRemoveTransaction}
            />
            <Balance balance={balance} />
        </>
    );
};

export default Home;
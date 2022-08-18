import { FunctionComponent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type TransactionInputProps = {
    onAddTransaction: (data: TransactionData) => void,
}

const startFormData: TransactionData = {
    id: '',
    date: new Date(),
    description: '',
    amount: 0,
};


const TransactionInput: FunctionComponent<TransactionInputProps> = ({ onAddTransaction }) => {
    const [data, setData] = useState(startFormData);

    return (
        <>
            <div>
                <span>Date</span>
                <input type="date" value={data.date?.toISOString().split('T')[0]} onChange={(e) => setData({ ...data, date: new Date(e.target.value) })} />
            </div>

            <div>
                <span>Description</span>
                <input type="text" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            </div>

            <div>
                <span>Amount</span>
                <input type="number" step="0.01" value={data.amount} onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) })}></input>
            </div>

            <button onClick={() => onAddTransaction({ ...data, id: uuidv4() })}>Add</button>
        </>
    );
};

export default TransactionInput;
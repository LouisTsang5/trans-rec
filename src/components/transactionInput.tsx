import { FunctionComponent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getDisplayName, getTransactionType, transactionTypeDisplayMap } from '../lib/transaction';

type TransactionInputProps = {
    onAddTransaction: (data: TransactionData) => void,
}

const startFormData: TransactionData = {
    id: '',
    date: new Date(),
    description: '',
    type: 'w',
    amount: 0,
};

const TransactionInput: FunctionComponent<TransactionInputProps> = ({ onAddTransaction }) => {
    const [data, setData] = useState(startFormData);

    const handleAddTransaction = () => {
        onAddTransaction({ ...data, id: uuidv4() });
        setData(startFormData);
    };

    return (
        <>
            <div>
                <span>Date</span>
                <input
                    type="date"
                    value={data.date?.toISOString().split('T')[0]}
                    onChange={(e) => setData({ ...data, date: new Date(e.target.value) })}
                />
            </div>

            <div>
                <span>Type</span>
                <select
                    value={getDisplayName(data.type)}
                    onChange={(e) => setData({ ...data, type: getTransactionType(e.target.value) })}
                >
                    {Object.entries(transactionTypeDisplayMap).map(([key, value]) => (
                        <option key={key}>{value}</option>
                    ))}
                </select>
            </div>

            <div>
                <span>Description</span>
                <input
                    type="text"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                />
            </div>

            <div>
                <span>Amount</span>
                <input
                    min="0"
                    type="number"
                    step="0.01"
                    value={data.amount}
                    onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) })}
                />
            </div>

            <button onClick={handleAddTransaction}>Add</button>
        </>
    );
};

export default TransactionInput;
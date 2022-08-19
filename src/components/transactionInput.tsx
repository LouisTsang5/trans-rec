import React, { FunctionComponent, useState } from 'react';
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

    const handleAddTransaction = (e: React.MouseEvent) => {
        e.preventDefault();
        onAddTransaction({ ...data, id: uuidv4() });
        setData(startFormData);
    };

    return (
        <form>
            <div className='row'>
                <div className='col form-group'>
                    <label htmlFor='dateInput'>Date</label>
                    <input
                        id='dateInput'
                        className='form-control'
                        type="date"
                        value={data.date?.toISOString().split('T')[0]}
                        onChange={(e) => setData({ ...data, date: new Date(e.target.value) })}
                    />
                </div>

                <div className='col form-group'>
                    <label htmlFor='typeInput'>Type</label>
                    <select
                        id='typeInput'
                        className='form-control'
                        value={getDisplayName(data.type)}
                        onChange={(e) => setData({ ...data, type: getTransactionType(e.target.value) })}
                    >
                        {Object.entries(transactionTypeDisplayMap).map(([key, value]) => (
                            <option key={key}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='form-group'>
                <label htmlFor='descriptionInput'>Description</label>
                <input
                    id='descriptionInput'
                    className='form-control'
                    type="text"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                />
            </div>

            <div className='row'>
                <div className='col-8 form-group'>
                    <span>Amount</span>
                    <input
                        className='form-control'
                        min="0"
                        type="number"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) })}
                    />
                </div>
                <div className='col-4 form-group d-flex justify-content-center align-items-end'>
                    <button className='btn btn-outline-primary w-100' onClick={handleAddTransaction}>Add</button>
                </div>
            </div>
        </form>
    );
};

export default TransactionInput;
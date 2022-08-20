import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDisplayName, getTransactionType, transactionTypeDisplayMap } from '../lib/transaction';

type TransactionProps = {
    list: TransactionData[],
    onSave: (id: string, updatedData: UpdatedTransactionData) => void,
}

function toUpdatedTransactionData(data: TransactionData): UpdatedTransactionData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...remain } = data;
    return remain;
}

const Transaction: FunctionComponent<TransactionProps> = ({ list, onSave }) => {
    const params = useParams();
    const transaction = useMemo(() => list.find(item => item.id === params.transactionId), [params]);

    if (!transaction) return <span>Cannot find transaction</span>;

    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [updatedData, setUpdatedData] = useState(toUpdatedTransactionData(transaction));
    useEffect(() => setUpdatedData(transaction), [transaction]);

    const onClickSave = (e: React.MouseEvent) => {
        e.preventDefault();
        onSave(transaction.id, updatedData);
        setIsSaved(true);
        navigate(-1);
    };

    const onClickCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <>
            <form>
                <div className='form-group'>
                    <label>Date</label>
                    <input type='date'
                        className='form-control'
                        value={updatedData.date.toISOString().split('T')[0]}
                        onChange={(e) => setUpdatedData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                    />
                </div>

                <div className='form-group'>
                    <label>Type</label>
                    <select
                        id='typeInput'
                        className='form-control'
                        value={getDisplayName(updatedData.type)}
                        onChange={(e) => setUpdatedData({ ...updatedData, type: getTransactionType(e.target.value) })}
                    >
                        {Object.entries(transactionTypeDisplayMap).map(([key, value]) => (
                            <option key={key}>{value}</option>
                        ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Description</label>
                    <input type='text'
                        className='form-control'
                        value={updatedData.description}
                        onChange={(e) => setUpdatedData(prev => ({ ...prev, description: e.target.value }))}
                    />
                </div>

                <div className='form-group'>
                    <label>Amount</label>
                    <input type='number'
                        min='0'
                        step='0.01'
                        className='form-control'
                        value={updatedData.amount.toFixed(2)}
                        onChange={(e) => setUpdatedData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    />
                </div>
                <div className='form-group row my-2'>
                    <div className='col-6'>
                        <button className='btn btn-outline-primary w-100' onClick={onClickCancel}>Cancel</button>
                    </div>
                    <div className='col-6'>
                        <button className='btn btn-primary w-100' onClick={onClickSave}>Save</button>
                    </div>
                </div>
                {isSaved && <div className='w-100 d-flex justify-content-center'><span>Data Saved</span></div>}
            </form>
        </>
    );
};

export default Transaction;
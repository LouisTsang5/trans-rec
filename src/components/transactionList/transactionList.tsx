import { FunctionComponent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './transactionList.css';

type TransactionList = {
    list: TransactionData[],
    onRemoveTransaction: (id: string) => void,
}

const TransactionList: FunctionComponent<TransactionList> = ({ list, onRemoveTransaction }) => {
    //Scroll to bottom function
    const listBtmElem = useRef<HTMLDivElement>(null);
    useEffect(() => listBtmElem.current?.scrollIntoView({ behavior: 'smooth' }), [list]);

    //Navigation to transaction detail page
    const navigate = useNavigate();
    const onClickTransaction = (id: string) => {
        navigate(`/transactions/${id}`);
    };

    return (
        <>
            <table className='table mb-0'>
                <thead>
                    <tr>
                        <th className='col-date'>Date</th>
                        <th className='col-desc' style={{ textAlign: 'center' }}>Description</th>
                        <th className='col-amt'>Amt</th>
                        <th className='col-del'></th>
                    </tr>
                </thead>
            </table>
            <div className='body-wrapper'>
                <table className='table'>
                    <tbody>
                        {list.map(data => (
                            <tr key={data.id}>
                                <td className='col-date' onClick={onClickTransaction.bind(undefined, data.id)}>
                                    {data.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </td>

                                <td className='col desc' onClick={onClickTransaction.bind(undefined, data.id)}>
                                    {data.description}
                                </td>

                                <td
                                    className='col-amt'
                                    style={{ color: data.type === 'd' ? 'green' : 'red' }}
                                >
                                    {`${data.type === 'd' ? '+' : '-'}${data.amount.toFixed(2)}`}
                                </td>

                                <td className='col-del' onClick={onRemoveTransaction.bind(undefined, data.id)}>
                                    <div className='d-flex justify-content-center align-items-end'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* For scrolling to bottom automatically*/}
                <div ref={listBtmElem}></div>
            </div>
        </>
    );
};

export default TransactionList;
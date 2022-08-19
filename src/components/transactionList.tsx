import { FunctionComponent } from 'react';

type TransactionList = {
    list: TransactionData[],
    onRemoveTransaction: (id: string) => void,
}

const TransactionList: FunctionComponent<TransactionList> = ({ list, onRemoveTransaction }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Desc</th>
                    <th>Amt</th>
                </tr>
            </thead>
            <tbody>
                {list.map(data => (
                    <tr key={data.id}>
                        <td>{data.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                        <td>{data.type.toUpperCase()}</td>
                        <td>{data.description}</td>
                        <td>{data.amount}</td>
                        <td><button onClick={() => onRemoveTransaction(data.id)}>x</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransactionList;
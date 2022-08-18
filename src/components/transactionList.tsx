import { FunctionComponent } from 'react';

type TransactionList = {
    list: TransactionData[],
    onRemoveTransaction: (id: string) => void,
}

const TransactionList: FunctionComponent<TransactionList> = ({ list, onRemoveTransaction }) => {
    return (<table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            {list.map(data => (
                <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.date.toISOString().split('T')[0]}</td>
                    <td>{data.description}</td>
                    <td>{data.amount}</td>
                    <td><a href="javascript:void(0)" onClick={() => onRemoveTransaction(data.id)}>x</a></td>
                </tr>
            ))}
        </tbody>
    </table>);
};

export default TransactionList;
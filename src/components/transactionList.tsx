import { FunctionComponent } from 'react';
import { getDisplayName } from '../lib/transaction';

type TransactionList = {
    list: TransactionData[],
    onRemoveTransaction: (id: string) => void,
}

const TransactionList: FunctionComponent<TransactionList> = ({ list, onRemoveTransaction }) => {
    return (<table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            {list.map(data => (
                <tr key={data.id}>
                    <td>{data.date.toISOString().split('T')[0]}</td>
                    <td>{getDisplayName(data.type)}</td>
                    <td>{data.description}</td>
                    <td>{data.amount}</td>
                    <td><button onClick={() => onRemoveTransaction(data.id)}>x</button></td>
                </tr>
            ))}
        </tbody>
    </table>);
};

export default TransactionList;
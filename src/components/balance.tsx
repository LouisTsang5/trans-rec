import { FunctionComponent } from 'react';

type BalanceProps = {
    balance: number,
}

const Balance: FunctionComponent<BalanceProps> = ({ balance }) => {
    return (
        <div>
            <span>Balance: </span>
            <span style={{
                color: balance > 0 ? 'green' : 'red'
            }}>${balance}
            </span>
        </div>
    );
};

export default Balance;
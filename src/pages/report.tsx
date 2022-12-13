import { FunctionComponent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toYyyyMmDd, getLastMonth, getMonthToDate } from '../lib/util';

const trySetDate = (setter: (date: Date | undefined) => void, val: string, fallback: Date | undefined) => {
    const newDate = new Date(val);
    if (newDate instanceof Date && !isNaN(newDate.getTime()))
        setter(new Date(val));
    else
        setter(fallback);
};

const getTopSpendingTrans = (transactions: TransactionData[], topN: number) => {
    let topTrans: TransactionData[] = [];
    transactions.forEach(tran => {
        //Insert if not list is not filled
        if (topTrans.length < topN) {
            topTrans = [...topTrans, tran];
            return;
        }
        //If the current transaction amount is higher than any transaction in the list, insert it to the top list and remove the lowest amount transaction in the list
        if (topTrans.some(topTran => tran.amount > topTran.amount)) {
            topTrans = [...topTrans, tran];
            const lowestTran = topTrans.reduce((prev, cur) => prev.amount <= cur.amount ? prev : cur);
            topTrans = topTrans.filter(topTran => topTran !== lowestTran);
            return;
        }
    });
    return topTrans.sort((a, b) => b.amount - a.amount); //return in descending order
};

type ReportResultProps = {
    transactions: TransactionData[],
    from: Date,
    to: Date,
}

const ReportResult: FunctionComponent<ReportResultProps> = ({ transactions, from, to }) => {
    const navigate = useNavigate();
    const topN = 10;
    const filteredTrans = useMemo(() => from && to ? transactions.filter(t => t.type === 'w' && t.date >= from && t.date <= to) : [], [from, to]);
    const totalSpending = useMemo(() => filteredTrans.length > 0 ? filteredTrans.map(t => t.amount).reduce((acc, cur) => acc + cur) : undefined, [filteredTrans]);
    const highestSpendingTrans = useMemo(() => getTopSpendingTrans(filteredTrans, topN), [filteredTrans]);

    return (
        <>
            <div style={{ marginTop: '1rem' }}>
                <span style={{ display: 'block' }}>Total Spending:</span>
                <span style={{ display: 'block', textAlign: 'center', fontSize: '1.5rem' }}>{totalSpending ? `$${totalSpending.toFixed(2)}` : 'N/A'}</span>
                <span style={{ display: 'block' }}>Top {topN} Highest Spending Item:</span>
                {
                    highestSpendingTrans.length > 0 &&
                    highestSpendingTrans.map((transaction, i) => (
                        <span
                            key={transaction.id}
                            style={{ display: 'block', textAlign: 'center', fontSize: `${1.5 - (i / 10)}rem` }}
                            onClick={() => navigate(`/transactions/${transaction.id}`)}
                        >{`${transaction.description} - $${transaction.amount.toFixed(2)}`} </span>
                    ))
                }
            </div>
        </>
    );
};

type ReportFilterProps = {
    from: Date | undefined,
    setFrom: (date: Date | undefined) => void,
    to: Date | undefined,
    setTo: (date: Date | undefined) => void,
};

const ReportFilter: FunctionComponent<ReportFilterProps> = ({ from, setFrom, to, setTo }) => {
    return (
        <form>
            <div className='row'>
                <div className='col form-group'>
                    <label htmlFor='from'>From</label>
                    <input
                        id='from'
                        className='form-control'
                        type='date'
                        value={from ? toYyyyMmDd(from) : ''}
                        onChange={(e) => trySetDate(setFrom, e.target.value, undefined)}
                    />
                </div>

                <div className='col form-group'>
                    <label htmlFor='to'>To</label>
                    <input
                        id='to'
                        className='form-control'
                        type='date'
                        value={to ? toYyyyMmDd(to) : ''}
                        onChange={(e) => trySetDate(setTo, e.target.value, undefined)}
                    />
                </div>
            </div>
        </form>
    );
};

type ReportProps = {
    transactions: TransactionData[],
}

const Report: FunctionComponent<ReportProps> = ({ transactions }) => {
    const [from, setFrom] = useState<Date>();
    const [to, setTo] = useState<Date>();

    const lastMonth = useMemo(() => getLastMonth(), []);
    const thisMonth = useMemo(() => getMonthToDate(), []);

    return (
        <>
            <div style={{ marginTop: '1rem' }}></div>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <h5>Last Month</h5>
                <ReportResult from={lastMonth.start} to={lastMonth.end} transactions={transactions} />
            </div>
            <hr />
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <h5>This Month - Now</h5>
                <ReportResult from={thisMonth.start} to={thisMonth.end} transactions={transactions} />
            </div>
            <hr />
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <h5>Custom</h5>
                <ReportFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
                {
                    from && to &&
                    <ReportResult from={from} to={to} transactions={transactions} />
                }
            </div>
        </>
    );
};

export default Report;
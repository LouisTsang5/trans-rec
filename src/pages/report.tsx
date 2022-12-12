import { FunctionComponent, useMemo, useState } from 'react';

const getLastMonth = () => {
    const cur = new Date();
    const start = new Date(cur.getFullYear(), cur.getMonth() - 1, 1);
    const end = new Date(cur.getFullYear(), cur.getMonth(), 0);
    return { start, end };
};

const getMonthToDate = () => {
    const cur = new Date();
    const start = new Date(cur.getFullYear(), cur.getMonth(), 1);
    return { start, end: cur };
};

const trySetDate = (setter: (date: Date | undefined) => void, val: string, fallback: Date | undefined) => {
    const newDate = new Date(val);
    if (newDate instanceof Date && !isNaN(newDate.getTime()))
        setter(new Date(val));
    else
        setter(fallback);
};

const toYyyyMmDd = (date: Date) => {
    return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

type ReportResultProps = {
    transactions: TransactionData[],
    from: Date,
    to: Date,
}

const ReportResult: FunctionComponent<ReportResultProps> = ({ transactions, from, to }) => {
    const filteredTrans = useMemo(() => from && to ? transactions.filter(t => t.type === 'w' && t.date >= from && t.date <= to) : [], [from, to]);
    const totalSpending = useMemo(() => filteredTrans.length > 0 ? filteredTrans.map(t => t.amount).reduce((acc, cur) => acc + cur) : undefined, [filteredTrans]);
    const highestSpendingTrans = useMemo(() => filteredTrans.length > 0 ? filteredTrans.reduce((prev, cur) => prev.amount > cur.amount ? prev : cur) : undefined, [filteredTrans]);
    return (
        <>
            <div style={{ marginTop: '1rem' }}>
                <span style={{ display: 'block' }}>Total Spending:</span>
                <span style={{ display: 'block', textAlign: 'center', fontSize: '1.5rem' }}>{totalSpending ? `$${totalSpending.toFixed(2)}` : 'N/A'}</span>
                <span style={{ display: 'block' }}>Highest Spending Item:</span>
                <span style={{ display: 'block', textAlign: 'center', fontSize: '1.5rem' }}>{highestSpendingTrans ? `${highestSpendingTrans.description} - $${highestSpendingTrans.amount.toFixed(2)}` : 'N/A'} </span>
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
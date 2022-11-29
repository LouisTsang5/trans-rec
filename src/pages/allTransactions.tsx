import { FunctionComponent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function isYInElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    const isInY = y >= rect.top && y <= rect.bottom;
    return isInY;
}

function isYAboveElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    return y <= rect.top;
}

function getTargetIndex(elems: HTMLElement[], y: number) {
    if (isYAboveElem(elems[0], y)) return -1;
    const index = elems.findIndex(elem => isYInElem(elem, y));
    if (index === -1) return undefined;
    return index;
}

const ListItem: FunctionComponent<{
    transaction: TransactionData,
    onTouchMove?: (e: React.TouchEvent<HTMLElement>) => void,
    onTouchEnd?: (e: React.TouchEvent<HTMLElement>) => void,
    onRemoveTransaction?: (id: string) => void,
}> = ({ transaction, onTouchMove, onTouchEnd, onRemoveTransaction }) => {
    const { description, date, type, amount, id } = transaction;

    const navigate = useNavigate();
    const onClickTransaction = () => {
        navigate(`/transactions/${id}`);
    };

    const onClickRemove = onRemoveTransaction ? () => {
        onRemoveTransaction(id);
    } : undefined;

    return (
        <>
            <td
                style={{ width: '10%', touchAction: 'none', padding: '0.5rem' }}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className='d-flex justify-content-center align-items-end'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30%" fill="grey" className="bi bi-x" viewBox="-5 0 40 125">
                        <path xmlns="http://www.w3.org/2000/svg" className="cls-1" d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z" />
                    </svg>
                </div>
            </td>

            <td style={{ width: '20%' }}>
                {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </td>

            <td style={{ width: '40%' }} onClick={onClickTransaction}>
                {description}
            </td>

            <td
                style={{
                    color: type === 'd' ? 'green' : 'red',
                    textAlign: 'right',
                    width: '20%',
                }}
                onClick={onClickTransaction}
            >
                {`${type === 'd' ? '+' : '-'}${amount.toFixed(2)}`}
            </td>

            <td style={{ width: '10%' }} onClick={onClickRemove}>
                <div className='d-flex justify-content-center align-items-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </div>
            </td>
        </>
    );
};

const DropSpace: FunctionComponent = () => {
    return (
        <div style={{
            backgroundColor: 'gray',
            opacity: '50%',
            width: '100%',
            height: '1rem',
        }} />
    );
};

type AllTransactionProps = {
    list: TransactionData[],
    onRearrange: (from: number, to: number) => void,
    onRemoveTransaction: (id: string) => void,
}

const AllTransactions: FunctionComponent<AllTransactionProps> = ({ list, onRearrange, onRemoveTransaction }) => {
    const listElems = useRef<HTMLElement[]>([]);
    const [touchedY, setTouchedY] = useState(undefined as number | undefined);
    const [draggedI, setDraggedI] = useState(undefined as undefined | number);

    const handleTouchMove = (i: number, e: React.TouchEvent<HTMLElement>) => {
        setTouchedY(e.targetTouches[0].pageY);
        setDraggedI(i);
    };

    const handleTouchEnd = () => {
        if (touchedY !== undefined && draggedI !== undefined) {
            const targetIndex = getTargetIndex(listElems.current, touchedY);
            if (targetIndex !== undefined) onRearrange(draggedI, targetIndex);
        }
        setTouchedY(undefined);
        setDraggedI(undefined);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <table className='table mb-0' style={{ flex: '0 1 auto' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}></th>
                            <th style={{ width: '20%' }}>Date</th>
                            <th style={{ width: '40%' }}>Description</th>
                            <th style={{ width: '20%', textAlign: 'right' }}>Amt</th>
                            <th style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                </table>

                <div style={{ flex: '1 1 auto', overflowY: 'scroll' }}>
                    <table className='table'>
                        <tbody>
                            {
                                touchedY !== undefined && isYAboveElem(listElems.current[0], touchedY) &&
                                <DropSpace />
                            }
                            {list.map((transaction, i) => (
                                <tr
                                    key={i}
                                    ref={elem => listElems.current[i] = elem as HTMLElement}
                                    style={{ display: draggedI === i ? 'none' : 'block' }}
                                >
                                    <ListItem
                                        transaction={transaction}
                                        onTouchMove={handleTouchMove.bind(undefined, i)}
                                        onTouchEnd={handleTouchEnd}
                                        onRemoveTransaction={onRemoveTransaction}
                                    />
                                    {
                                        touchedY !== undefined && isYInElem(listElems.current[i], touchedY) &&
                                        <DropSpace />
                                    }
                                </tr>
                            ))}
                            {
                                draggedI !== undefined && touchedY !== undefined &&
                                <tr style={{
                                    position: 'absolute',
                                    display: 'block',
                                    left: `1rem`,
                                    top: touchedY,
                                }} >
                                    <ListItem transaction={list[draggedI]} />
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AllTransactions;
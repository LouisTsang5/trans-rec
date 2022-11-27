import { FunctionComponent, useRef, useState } from 'react';

// function immutableInert<T>(arr: T[], index: number, newItem: T): T[] {
//     return [
//         ...arr.slice(0, index),
//         newItem,
//         ...arr.slice(index)
//     ];
// }

// function immutableMove<T>(arr: T[], curIndex: number, newIndex: number): T[] {
//     const item = arr[curIndex];
//     const newArr = arr.filter((val, i) => i !== curIndex);
//     return immutableInert(newArr, newIndex > curIndex ? newIndex - 1 : newIndex, item);
// }

function isYInElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    const isInY = y >= rect.top && y <= rect.bottom;
    return isInY;
}

function isYAboveElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    return y <= rect.top;
}

type AllTransactionProps = {
    list: TransactionData[],
}

const ListItem: FunctionComponent<{ transaction: TransactionData }> = ({ transaction }) => {
    return (
        <span
            style={{
                display: 'block',
                border: 'black solid 1px',
                borderRadius: '10px',
            }}
        >
            {transaction.description}
        </span>
    );
};

const DropSpace: FunctionComponent = () => {
    return (
        <div style={{
            backgroundColor: 'gray',
            opacity: '50%',
            width: '100%',
            height: '0.5rem',
        }} />
    );
};

const AllTransactions: FunctionComponent<AllTransactionProps> = ({ list }) => {
    const listElems = useRef<HTMLElement[]>([]);
    const [touchedY, setTouchedY] = useState(undefined as number | undefined);
    const [draggedItem, setDraggedItem] = useState(undefined as undefined | TransactionData);

    const handleTouchMove = (item: TransactionData, e: React.TouchEvent<HTMLLIElement>) => {
        setTouchedY(e.targetTouches[0].pageY);
        setDraggedItem(item);
    };

    const handleTouchEnd = () => {
        setTouchedY(undefined);
        setDraggedItem(undefined);
    };

    return (
        <>
            <ul style={{ touchAction: 'none' }}>
                {
                    touchedY !== undefined && isYAboveElem(listElems.current[0], touchedY) &&
                    <DropSpace />
                }
                {

                    list.map((transaction, i) => (<>
                        <li
                            key={i}
                            ref={elem => listElems.current[i] = elem as HTMLElement}
                            style={{ display: draggedItem === transaction ? 'none' : 'block' }}
                            onTouchMove={handleTouchMove.bind(undefined, transaction)}
                            onTouchEnd={handleTouchEnd}
                        >
                            <ListItem transaction={transaction} />
                        </li>
                        {
                            touchedY !== undefined && isYInElem(listElems.current[i], touchedY) &&
                            <DropSpace />
                        }
                    </>))
                }
                {
                    draggedItem !== undefined && touchedY !== undefined &&
                    <li style={{
                        position: 'absolute',
                        left: `1rem`,
                        top: touchedY,
                    }} >
                        <ListItem transaction={draggedItem} />
                    </li>
                }
            </ul >
        </>
    );
};

export default AllTransactions;
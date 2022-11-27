import { FunctionComponent, useRef, useState } from 'react';

function isYInElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    const isInY = y >= rect.top && y <= rect.bottom;
    return isInY;
}

function isYAboveElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    return y <= rect.top;
}

function isYBelowElem(elem: HTMLElement, y: number) {
    const rect = elem.getBoundingClientRect();
    return y >= rect.bottom;
}

function getTargetIndex(elems: HTMLElement[], y: number) {
    if (isYAboveElem(elems[0], y)) return -1;
    if (isYBelowElem(elems[elems.length - 1], y)) return elems.length - 1;
    const index = elems.findIndex(elem => isYInElem(elem, y));
    if (index === -1) return undefined;
    return index;
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
            height: '1rem',
        }} />
    );
};

type AllTransactionProps = {
    list: TransactionData[],
    onRearrange: (from: number, to: number) => void,
}

const AllTransactions: FunctionComponent<AllTransactionProps> = ({ list, onRearrange }) => {
    const listElems = useRef<HTMLElement[]>([]);
    const [touchedY, setTouchedY] = useState(undefined as number | undefined);
    const [draggedI, setDraggedI] = useState(undefined as undefined | number);

    const handleTouchMove = (i: number, e: React.TouchEvent<HTMLLIElement>) => {
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
            <ul style={{ touchAction: 'none', padding: '0' }}>
                {
                    touchedY !== undefined && isYAboveElem(listElems.current[0], touchedY) &&
                    <DropSpace />
                }
                {

                    list.map((transaction, i) => (<>
                        <li
                            key={i}
                            ref={elem => listElems.current[i] = elem as HTMLElement}
                            style={{ display: draggedI === i ? 'none' : 'block' }}
                            onTouchMove={handleTouchMove.bind(undefined, i)}
                            onTouchEnd={handleTouchEnd}
                        >
                            <ListItem transaction={transaction} />
                            {
                                touchedY !== undefined &&
                                (
                                    isYInElem(listElems.current[i], touchedY) ||
                                    (i === list.length - 1 && isYBelowElem(listElems.current[i], touchedY))
                                ) &&
                                <DropSpace />
                            }
                        </li>
                    </>))
                }
                {
                    draggedI !== undefined && touchedY !== undefined &&
                    <li style={{
                        position: 'absolute',
                        display: 'block',
                        left: `1rem`,
                        top: touchedY,
                    }} >
                        <ListItem transaction={list[draggedI]} />
                    </li>
                }
            </ul >
        </>
    );
};

export default AllTransactions;
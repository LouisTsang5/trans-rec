import { FunctionComponent, useState } from 'react';

export const BusSearch: FunctionComponent = () => {
    const [busNum, setBusNum] = useState('');

    return (
        <form>
            <div className='col-12 form-group'>
                <span>Bus</span>
                <input
                    onFocus={() => setBusNum('')}
                    onChange={e => setBusNum(e.target.value.toUpperCase())}
                    value={busNum}
                    className={`form-control`}
                    type="text"
                />
            </div>
        </form>
    );
};
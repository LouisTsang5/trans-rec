import { FunctionComponent, useMemo, useState } from 'react';
import { getRoutes } from '../lib/busStop/kmb';
import { debounce } from '../lib/util';

type BusInfo = {
    number: string,
    from: string,
    to: string,
}

const MAX_LIST_ITEMS = 50;
const DEBOUNCE_DELAY_MS = 500;

async function searchBus(busNum: string) {
    const allBuses = await getRoutes();
    const busInfoList: BusInfo[] = allBuses.map(b => ({ number: b.route, from: b.orig_tc, to: b.dest_tc }));
    return busInfoList.filter(b => b.number.startsWith(busNum)).slice(0, MAX_LIST_ITEMS).sort((a, b) => a.number.localeCompare(b.number));
}

const SearchBar: FunctionComponent<{ onSearch: (busNum: string) => void }> = ({ onSearch }) => {
    const debouncedSearch = useMemo(() => debounce(onSearch, DEBOUNCE_DELAY_MS), []);
    return (
        <form>
            <div className='col-12 form-group'>
                <span>Bus</span>
                <input
                    onFocus={e => e.target.value = ''}
                    onChange={e => debouncedSearch(e.target.value.toUpperCase())}
                    className={`form-control`}
                    type="text"
                />
            </div>
        </form>
    );
};

const BusList: FunctionComponent<{ list: BusInfo[] }> = ({ list }) => {
    return (
        <ul>
            {list.map(({ number, from, to }, i) => (
                <li key={i}><span>{number} {from} {'->'} {to}</span></li>
            ))}
        </ul>
    );
};

export const BusSearch: FunctionComponent = () => {
    const [busInfoList, setBusInfoList] = useState<BusInfo[]>([]);
    const search = async (num: string) => setBusInfoList(await searchBus(num));

    return (
        <>
            <SearchBar onSearch={search} />
            <BusList list={busInfoList} />
        </>
    );
};
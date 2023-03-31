import { FunctionComponent, useMemo, useState } from 'react';
import { getAllRoutes, RouteInfo } from '../lib/busStop/common';
import { debounce } from '../lib/util';

const MAX_LIST_ITEMS = 50;
const DEBOUNCE_DELAY_MS = 500;

async function searchBus(busNum: string) {
    if (!busNum) return [];
    const allRoutes = await getAllRoutes();
    return allRoutes.filter(b => b.number.startsWith(busNum)).slice(0, MAX_LIST_ITEMS).sort((a, b) => a.number.localeCompare(b.number));
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

const BusList: FunctionComponent<{ list: RouteInfo[] }> = ({ list }) => {
    return (
        <ul>
            {list.map(({ number, from, to, company, bound }, i) => (
                <li key={i}>
                    <span>{number}</span><span> {company} {bound}</span>
                    <br />
                    <span>{from} {'->'} {to}</span>
                </li>
            ))}
        </ul>
    );
};

export const BusSearch: FunctionComponent = () => {
    const [busInfoList, setBusInfoList] = useState<RouteInfo[]>([]);
    const search = async (num: string) => setBusInfoList(await searchBus(num));

    return (
        <>
            <SearchBar onSearch={search} />
            <BusList list={busInfoList} />
        </>
    );
};
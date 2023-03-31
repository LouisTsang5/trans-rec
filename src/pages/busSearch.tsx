import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { getAllRoutes, RouteInfo } from '../lib/busStop/common';
import { debounce } from '../lib/util';

const MAX_LIST_ITEMS = 50;
const DEBOUNCE_DELAY_MS = 500;

const SearchBar: FunctionComponent<{ onSearch: (busNum: string) => void }> = ({ onSearch }) => {
    const debouncedSearch = useMemo(() => debounce(onSearch, DEBOUNCE_DELAY_MS), [onSearch]);
    return (
        <form>
            <div className='col-12 form-group'>
                <span>Bus</span>
                <input
                    onFocus={e => e.target.value = ''}
                    onChange={e => {
                        e.target.value = e.target.value.toUpperCase();
                        debouncedSearch(e.target.value.toUpperCase());
                    }}
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
    const [routesList, setRoutesList] = useState<RouteInfo[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const refreshRoutes = async () => {
        setIsLoadingList(true);
        setRoutesList(await getAllRoutes());
        setIsLoadingList(false);
    };
    useEffect(() => {
        refreshRoutes();
    }, []);

    const [hitList, setHitList] = useState<RouteInfo[]>([]);
    const search = useMemo(() => (route: string) => {
        if (!route) return setHitList([]);
        setHitList(routesList.filter(b => b.number.startsWith(route)).slice(0, MAX_LIST_ITEMS).sort((a, b) => a.number.localeCompare(b.number)));
    }, [routesList]);

    return (
        <>
            {
                isLoadingList ?
                    <span>Loading bus list...</span> :
                    <>
                        <SearchBar onSearch={search} />
                        <BusList list={hitList} />
                    </>

            }
        </>
    );
};
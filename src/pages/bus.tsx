import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { getAllRoutes, RouteInfo } from '../lib/busStop/common';
import { debounce } from '../lib/util';

const MAX_LIST_ITEMS = 50;
const DEBOUNCE_DELAY_MS = 500;

const SearchBar: FunctionComponent<{ onSearch: (busNum: string) => void }> = ({ onSearch }) => {
    const debouncedSearch = useMemo(() => debounce(onSearch, DEBOUNCE_DELAY_MS), [onSearch]);
    return (
        <form style={{
            marginBottom: '0.5rem'
        }}>
            <div className='col-12 form-group'>
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
        <ul className='list-group'>
            {list.map(({ number, from, to, company }, i) => (
                <li key={i} className='list-group-item' style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }} >
                    <div style={{ gridRow: 'span 3', gridColumn: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center' }}>{number}</span>
                    </div>
                    <span style={{ gridRow: '1 / span 2', gridColumn: '2 / span 4', fontSize: '1.2rem', paddingLeft: '1rem' }}>{`${from} -> ${to}`}</span>
                    <span style={{ gridRow: '3', gridColumn: '2 / span 4', fontSize: '0.8rem', paddingLeft: '1rem' }}>{company}</span>
                </li>
            ))}
        </ul>
    );
};

const BusSearch: FunctionComponent = () => {
    const [routesList, setRoutesList] = useState<RouteInfo[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const refreshRoutes = async (abortSignal?: AbortSignal) => {
        setIsLoadingList(true);
        setRoutesList(await getAllRoutes(abortSignal));
        setIsLoadingList(false);
    };
    useEffect(() => {
        const abortController = new AbortController();
        refreshRoutes(abortController.signal).then(() => console.log('Bus routes refreshed'));
        return () => abortController.abort();
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

const BusSchedule: FunctionComponent = () => {
    return <span>Schedule</span>;
};

export const Bus: FunctionComponent = () => {
    return (
        <Routes>
            <Route path={`/`} element={<BusSearch />} />
            <Route path={`/schedule`} element={<BusSchedule />} />
        </Routes>
    );
};
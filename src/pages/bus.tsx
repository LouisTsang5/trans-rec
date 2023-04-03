import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { Bound, getAllRoutes, isCtbRoute, isKmbRoute, RouteInfo } from '../lib/busStop/common';
import { getStopsEtas as getKmbStopsEtas } from '../lib/busStop/kmb';
import { getStopsEtas as getCtbStopsEtas, Company as CtbCompany } from '../lib/busStop/ctb';
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

function getQueryParam({ data, bound }: RouteInfo): URLSearchParams {
    if (isCtbRoute(data)) {
        const { route, co: company } = data;
        return new URLSearchParams({ route, bound, company });
    } else if (isKmbRoute(data)) {
        const { route, service_type: servicetype } = data;
        return new URLSearchParams({ route, bound, company: 'KMB', servicetype });
    } else {
        const { route } = data;
        return new URLSearchParams({ route, bound, company: 'MTR' });
    }
}

const BusList: FunctionComponent<{ list: RouteInfo[] }> = ({ list }) => {
    const navigate = useNavigate();
    return (
        <ul className='list-group'>
            {list.map((route, i) => {
                const { number, from, to, company } = route;
                return (
                    <li key={i} className='list-group-item' style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }} onClick={() => navigate({ pathname: 'schedule', search: `?${getQueryParam(route)}` })}>
                        <div style={{ gridRow: 'span 3', gridColumn: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'right' }}>{number}</span>
                        </div>
                        <span style={{ gridRow: '1 / span 2', gridColumn: '2 / span 4', fontSize: '1.2rem', paddingLeft: '1rem' }}>{`${from} -> ${to}`}</span>
                        <span style={{ gridRow: '3', gridColumn: '2 / span 4', fontSize: '0.8rem', paddingLeft: '1rem' }}>{company}</span>
                    </li>
                );
            })}
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
    const [searchParams] = useSearchParams();
    const route = searchParams.get('route');
    const bound = searchParams.get('bound') as Bound;
    const company = searchParams.get('company');
    const serviceType = searchParams.get('servicetype');

    // If not enough search params return error
    const errorJsx = <span>Not enough arguments</span>;
    if (!route || !bound || !company) return errorJsx;
    if (company === 'KMB' && !serviceType) return errorJsx;

    const pStopsEtas = company === 'KMB' ? getKmbStopsEtas(route, bound, serviceType as string) : getCtbStopsEtas(company as CtbCompany, route, bound);
    pStopsEtas.then(se => console.log(se));

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
import { parse } from '../csv';
import { Bound } from './common';

export type MtrRoute = {
    route: string,
    from: string,
    to: string,
    bound: Bound,
    company: 'MTR',
}

export type MtrStop = {
    seq: number,
    id: string,
    lat: number,
    long: number,
    name_en: string,
    name_tc: string
}

const COMPANY = 'MTR';
const ROUTE_DELIMITER = '至';

export async function getRoutes(abortSignal?: AbortSignal): Promise<MtrRoute[]> {
    const url = '/mtr_bus_routes.csv';
    const text = await (await fetch(url, { signal: abortSignal })).text();
    const csv = parse(text);
    const result: MtrRoute[] = [];
    for (const [route, direction] of csv.rows) {
        const [from, to] = direction.split(ROUTE_DELIMITER);
        result.push({
            route, from, to, bound: 'O', company: COMPANY
        });
        result.push({
            route, from: to, to: from, bound: 'I', company: COMPANY
        });
    }
    return result;
}

const ROUTE_INDEX = 0;
const BOUND_INDEX = 1;
const SEQ_INDEX = 2;
const STOP_ID_INDEX = 3;
const LAT_INDEX = 4;
const LONG_INDEX = 5;
const NAME_TC_INDEX = 6;
const NAME_EN_INDEX = 7;

export async function getRouteStops(route: string, bound: Bound): Promise<MtrStop[]> {
    const url = '/mtr_bus_stops.csv';
    const text = await (await fetch(url)).text();
    const csv = parse(text);
    const rows = csv.rows.filter(r => r[ROUTE_INDEX] === route && r[BOUND_INDEX] === bound);
    return rows.map(r => ({
        seq: parseInt(r[SEQ_INDEX]),
        id: r[STOP_ID_INDEX],
        lat: parseFloat(r[LAT_INDEX]),
        long: parseFloat(r[LONG_INDEX]),
        name_en: r[NAME_EN_INDEX],
        name_tc: r[NAME_TC_INDEX],
    })).sort((a, b) => a.seq - b.seq);
}

type MtrBusSchedule = {
    arrivalTimeInSecond: string,
    arrivalTimeText: string,
    busId: string,
    busLocation: {
        latitude: number,
        longitude: number,
    },
    busRemark: string,
    departureTimeInSecond: string,
    departureTimeText: string,
    isDelayed: '0' | '1',
    isScheduled: '0' | '1',
    lineRef: string,
}

type MtrBusStopSchedule = {
    bus: MtrBusSchedule[],
    busStopId: string,
    isSuspended: '0' | '1',
}

type MtrApiResponse = {
    appRefreshTimeInSecond: string,
    busStop: MtrBusStopSchedule[],
    footerRemarks: string,
    routeName: string,
    routeStatusTime: Date,
    status: '0' | '1',
}

async function getSchedules(route: string) {
    const url = 'https://rt.data.gov.hk/v1/transport/mtr/bus/getSchedule';
    const language = 'zh';
    const body = { language, routeName: route };
    const res = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }).then(res => res.json() as Promise<MtrApiResponse>);
    return res.busStop;
}

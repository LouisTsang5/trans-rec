import { StopEta } from './common';

const baseUrl = new URL('https://rt.data.gov.hk');
type Company = 'NWFB' | 'CTB';
type Direction = 'inbound' | 'outbound';
type Dir = 'I' | 'O';

type CtbApiResponse<T> = {
    type: string,
    version: string,
    generated_timestamp: Date,
    data: T
}

type CtbRoute = {
    co: Company,
    route: string,
    orig_tc: string,
    orig_sc: string,
    orig_en: string,
    dest_tc: string,
    dest_sc: string,
    dest_en: string,
    data_timestamp: Date,
}

type CtbRouteStop = {
    co: Company,
    route: string,
    dir: Dir,
    seq: number,
    stop: string,
    data_timestamp: Date,
}

type CtbStop = {
    stop: string,
    name_tc: string,
    name_sc: string,
    name_en: string,
    lat: number,
    long: number,
    data_timestamp: Date,
}

type CtbStopEta = {
    co: Company,
    route: string,
    dir: Dir,
    seq: number,
    stop: string,
    eta_seq: number,
    eta: Date,
    rmk_tc: string,
    rmk_sc: string,
    rmk_en: string,
    data_timestamp: Date,
}

export async function getRoutes(company: Company) {
    const url = new URL(`/v1.1/transport/citybus-nwfb/route/${company}`, baseUrl);
    const res = await fetch(url);
    return (await res.json() as CtbApiResponse<CtbRoute[]>).data;
}

async function getRouteStops(company: Company, route: string, direction: Direction) {
    const url = new URL(`/v1.1/transport/citybus-nwfb/route-stop/${company}/${route}/${direction}`, baseUrl);
    const res = await fetch(url);
    return (await res.json() as CtbApiResponse<CtbRouteStop[]>).data;
}

async function getStop(stopId: string) {
    const url = new URL(`/v1.1/transport/citybus-nwfb/stop/${stopId}`, baseUrl);
    const res = await fetch(url);
    return (await res.json() as CtbApiResponse<CtbStop>).data;
}

async function getStopEta(company: Company, stopId: string, route: string) {
    const url = new URL(`/v1.1/transport/citybus-nwfb/eta/${company}/${stopId}/${route}`, baseUrl);
    const res = await fetch(url);
    return (await res.json() as CtbApiResponse<CtbStopEta[]>).data;
}

export async function getStopsEtas(company: Company, route: string, direction: Direction) {
    const rs = await getRouteStops(company, route, direction);
    const stops = await Promise.all(rs.map(async s => {
        const [stop, etas] = await Promise.all([getStop(s.stop), getStopEta(company, s.stop, route)]);
        const stopEta: StopEta = {
            seq: s.seq,
            stop_tc: stop.name_tc,
            stop_sc: stop.name_sc,
            stop_en: stop.name_en,
            etas: etas.map(e => ({
                seq: e.eta_seq,
                eta: e.eta,
                remarksEn: e.rmk_en,
                remarksTc: e.rmk_tc,
                remarksSc: e.rmk_sc,
            })),
        };
        return stopEta;
    }));
    return stops;
}
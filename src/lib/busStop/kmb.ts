import { StopEta } from './common';

type Bound = 'I' | 'O';

type KmbBusApiResponse<T> = {
    type: string,
    version: string,
    generated_timestamp: Date,
    data: T,
};

type KmbBusRoute = {
    route: string,
    bound: string,
    service_type: string,
    orig_en: string,
    orig_tc: string,
    orig_sc: string,
    dest_en: string,
    dest_tc: string,
    dest_sc: string,
}

type KmbRouteStop = {
    co: string,
    route: string,
    bound: string,
    service_type: string,
    seq: number,
    stop: string,
}

type KmbBusStop = {
    stop: string,
    name_tc: string,
    name_en: string,
    name_sc: string,
    lat: number,
    long: number,
}

type KmbStopEta = {
    co: string,
    route: string,
    dir: string, // = bound
    service_type: string,
    seq: number,
    stop: string,
    dest_tc: string,
    dest_sc: string,
    dest_en: string,
    eta_seq: number,
    eta: Date,
    rmk_tc: string,
    rmk_sc: string,
    rmk_en: string,
    data_timestamp: Date,
}

const baseUrl = new URL('https://data.etabus.gov.hk');

export async function getRoutes() {
    const res = await fetch(new URL('/v1/transport/kmb/route/', baseUrl));
    const routes = (await res.json() as KmbBusApiResponse<KmbBusRoute[]>).data;
    return routes;
}

async function getRouteStops(route: string, bound: Bound, serviceType: string) {
    const direction = bound === 'O' ? 'outbound' : 'inbound';
    const url = new URL(`/v1/transport/kmb/route-stop/${route}/${direction}/${serviceType}`, baseUrl);
    const res = await fetch(url);
    const routeStops = (await res.json() as KmbBusApiResponse<KmbRouteStop[]>).data;
    return routeStops.map(({ route, bound, service_type, seq: seq_str, stop }) => ({ route, bound, service_type, stop, seq: parseInt(seq_str as unknown as string) })); // seq is a string instead of a number in this api endpoint
}

async function getStop(stopId: string) {
    const url = new URL(`/v1/transport/kmb/stop/${stopId}`, baseUrl);
    const res = await fetch(url);
    const stop = (await res.json() as KmbBusApiResponse<KmbBusStop>).data;
    return stop;
}

async function getEtas(route: string, serviceType: string, stop: string) {
    const url = new URL(`/v1/transport/kmb/eta/${stop}/${route}/${serviceType}`, baseUrl);
    const res = await fetch(url);
    const eta = (await res.json() as KmbBusApiResponse<KmbStopEta[]>).data;
    return eta;
}

export async function getStopsEtas(route: string, bound: Bound, serviceType: string) {
    const routeStops = await getRouteStops(route, bound, serviceType);
    const stopEtas: StopEta[] = [];
    await Promise.all(routeStops.map(async rs => {
        const [stopRaw, etasRaw] = await Promise.all([getStop(rs.stop), getEtas(route, serviceType, rs.stop)]);
        const { name_en, name_sc, name_tc } = stopRaw;
        const etas = etasRaw.sort((a, b) => a.eta_seq - b.eta_seq).map(e => ({
            seq: e.eta_seq,
            eta: e.eta,
            remarksTc: e.rmk_tc,
            remarksSc: e.rmk_sc,
            remarksEn: e.rmk_en,
        }));
        stopEtas.push({ seq: rs.seq, stop_tc: name_tc, stop_en: name_en, stop_sc: name_sc, etas });
    }));
    stopEtas.sort((a, b) => a.seq - b.seq);
    return stopEtas;
}
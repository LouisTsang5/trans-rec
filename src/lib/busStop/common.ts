import { Company as CtbCompany, CtbRoute, getRoutes as getCtbRoutes } from './ctb';
import { KmbRoute, getRoutes as getKmbRoutes } from './kmb';
import { getRoutes as getMtrRoutes, MtrRoute } from './mtr';

export type StopEta = {
    seq: number,
    stop_tc: string,
    stop_sc: string,
    stop_en: string,
    etas: {
        seq: number,
        eta: Date,
        remarksTc: string,
        remarksSc: string,
        remarksEn: string,
    }[],
}

export type Bound = 'I' | 'O';
type Company = CtbCompany | 'KMB' | 'MTR';

export type RouteInfo = {
    number: string,
    from: string,
    to: string,
    company: Company,
    bound: Bound,
    data: CtbRoute | KmbRoute | MtrRoute,
}

export function isCtbRoute(r: CtbRoute | KmbRoute | MtrRoute): r is CtbRoute {
    return 'co' in r;
}

function isCtbRoutes(rs: CtbRoute[] | KmbRoute[] | MtrRoute[]): rs is CtbRoute[] {
    return rs.length === 0 || isCtbRoute(rs[0]);
}

export function isKmbRoute(r: CtbRoute | KmbRoute | MtrRoute): r is KmbRoute {
    return 'service_type' in r;
}

function isKmbRoutes(rs: CtbRoute[] | KmbRoute[] | MtrRoute[]): rs is KmbRoute[] {
    return rs.length === 0 || isKmbRoute(rs[0]);
}

export async function getAllRoutes(abortSignal?: AbortSignal): Promise<RouteInfo[]> {
    // Request all routes
    const allRoutes: (CtbRoute[] | KmbRoute[] | MtrRoute[])[] = await Promise.all([
        getKmbRoutes(abortSignal).then(r => {
            console.log('KMB routes ready');
            return r;
        }),
        getCtbRoutes('CTB', abortSignal).then(r => {
            console.log('CTB routes ready');
            return r;
        }),
        getCtbRoutes('NWFB', abortSignal).then(r => {
            console.log('NWFB routes ready');
            return r;
        }),
        getMtrRoutes(abortSignal).then(r => {
            console.log('MTR routes ready');
            return r;
        }),
    ]);

    // Construct a route list
    const result: RouteInfo[] = [];
    allRoutes.forEach(routes => {
        if (isCtbRoutes(routes)) {
            // CTB
            routes.forEach(r => {
                result.push({
                    number: r.route,
                    from: r.orig_tc,
                    to: r.dest_tc,
                    company: r.co,
                    bound: 'O',
                    data: r,
                });
                result.push({
                    number: r.route,
                    from: r.dest_tc,
                    to: r.orig_tc,
                    company: r.co,
                    bound: 'I',
                    data: r,
                });
            });
        } else if (isKmbRoutes(routes)) {
            // KMB
            routes.forEach(r => {
                result.push({
                    number: r.route,
                    from: r.orig_tc,
                    to: r.dest_tc,
                    company: 'KMB',
                    bound: r.bound,
                    data: r,
                });
            });
        } else {
            // MTR
            routes.forEach(r => {
                result.push({
                    number: r.route,
                    from: r.from,
                    to: r.to,
                    company: r.company,
                    bound: r.bound,
                    data: r
                });
            });
        }
    });
    return result;
}
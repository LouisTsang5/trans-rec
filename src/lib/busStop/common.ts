import { Company as CtbCompany, CtbRoute, getRoutes as getCtbRoutes } from './ctb';
import { KmbRoute, getRoutes as getKmbRoutes } from './kmb';

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
type Company = CtbCompany | 'KMB';

export type RouteInfo = {
    number: string,
    from: string,
    to: string,
    company: Company,
    bound: Bound,
    data: CtbRoute | KmbRoute,
}

function isCtbRoute(r: CtbRoute | KmbRoute): r is CtbRoute {
    return 'co' in r;
}

function isCtbRoutes(rs: CtbRoute[] | KmbRoute[]): rs is CtbRoute[] {
    return rs.length === 0 || isCtbRoute(rs[0]);
}

export async function getAllRoutes(): Promise<RouteInfo[]> {
    // Request all routes
    const allRoutes: (CtbRoute[] | KmbRoute[])[] = await Promise.all([
        getKmbRoutes(),
        getCtbRoutes('CTB'),
        getCtbRoutes('NWFB'),
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
        } else {
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
        }
    });
    return result;
}
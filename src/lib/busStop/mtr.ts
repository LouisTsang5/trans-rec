import { parse } from '../csv';
import { Bound } from './common';

export type MtrRoute = {
    route: string,
    from: string,
    to: string,
    bound: Bound,
    company: 'MTR',
}

const COMPANY = 'MTR';
const ROUTE_DELIMITER = '至';

export async function getRoutes(): Promise<MtrRoute[]> {
    const url = '/mtr_bus_routes.csv';
    const text = await (await fetch(url)).text();
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
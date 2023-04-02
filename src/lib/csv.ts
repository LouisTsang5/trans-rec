export function parse(csv: string): Csv {
    const lines = csv.split(/\r?\n/);
    const matrix = lines.map(l => l.split(','));
    const headers = matrix[0];
    const rows = matrix.splice(1);
    return new Csv(headers, rows);
}

class Csv {
    constructor(
        private _headers: string[],
        private _rows: string[][],
    ) { }

    get headers() {
        return this._headers;
    }

    get rows() {
        return this._rows;
    }
}
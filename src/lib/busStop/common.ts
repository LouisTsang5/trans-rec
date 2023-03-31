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
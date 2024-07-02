export function compareNumber(n1?: number, n2?: number): number {
    if (!n1) return -1;
    if (!n2) return 1;
    if (!n1 && !n2) return 0;

    return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
}
export interface Comparator<T>{
    (o1: T, o2: T) : number;
}

export function comparatorOf<T>(extractor: (object: T)=>number): Comparator<T> {
    return (o1 : T, o2: T) => {
        return compareNumber(extractor(o1), extractor(o2));
    }
}
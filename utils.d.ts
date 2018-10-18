export declare type Point = [number, number];
export declare function sumArray(arr: number[]): number;
export declare function findMinIdx(arr: number[]): number;
export declare function filterIdxs(arr: number[], val: number): number[];
export declare function clusterCentroid(cluster: Array<Point>): Point;
export declare function chooseDistribution(distr: number[]): number;
export declare function sqDistance(p1: Point): (p: Point) => number;
export declare function getClosestPoint(p1: Point, pArray: Array<Point>): number;
export declare function arrayFrom(array: Array<any> | {
    length: number;
}, generator?: (_: any, idx: number) => any): Array<any>;

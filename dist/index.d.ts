import { Point, Iteration, Result, DistanceFunction } from './utils';
export declare class Clusterer {
    data: Array<Point>;
    constructor(data: Array<Point>, validate?: boolean);
    isNotPoint(p: Point): boolean;
    validateData(data: Array<Point>): boolean;
    randomPoint(): Point;
    getNextCluster(centroids: Array<Point>, distanceFn: DistanceFunction): Point;
    findNextCentroid(centroids: Array<Point>, centroidsNumber: number, distanceFn: DistanceFunction): Array<Point>;
    kmeans(centroids: Array<Point>, attributions: Array<number>, iterations: Array<Iteration>, distanceFn: DistanceFunction, iteration: number, maxIterations: number): {
        centroids: Array<Point>;
        attributions: Array<number>;
        iterations: Array<Iteration>;
    };
    recalculateAttributions(centroids: Array<Point>, attributions: Array<number>, distanceFn: DistanceFunction): [Array<number>, boolean];
    recalculateCentroids(centroids: Array<Point>, attributions: Array<number>): Array<Point>;
    clusterize(centroidsNumber?: number, maxIterations?: number, distanceFn?: DistanceFunction): Result;
}

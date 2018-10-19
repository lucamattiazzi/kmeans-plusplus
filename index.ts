import {
	filterIdxs,
	clusterCentroid,
	chooseDistribution,
	sqDistance,
	getClosestPoint,
	arrayFrom,
	Point,
	Iteration,
	Result,
	DistanceFunction,
} from './utils'

const DEF_CENTROIDS = 3
const DEF_ITERATIONS = 1e3

export class Clusterer {
	data: Array<Point>

	constructor(data: Array<Point>, validate: boolean = true) {
		if (validate && !this.validateData(data)) throw new Error('Data format wrong')
		this.data = data
	}

	isNotPoint(p: Point): boolean {
		return p.length === 0 || p.some(v => typeof v !== 'number')
	}

	validateData(data: Array<Point>): boolean {
		if (data.length === 0) return false
		if (data.some(this.isNotPoint)) return false
		return true
	}

	randomPoint(): Point {
		const idx = Math.floor(Math.random() * this.data.length)
		return this.data[idx]
	}

	getNextCluster(centroids: Array<Point>, distanceFn: DistanceFunction): Point {
		const probabilities = this.data.map(
			(point: Point): number => {
				const distances = centroids.map(centroid => distanceFn(point, centroid))
				return Math.min(...distances)
			},
		)
		const idx = chooseDistribution(probabilities)
		return this.data[idx]
	}

	findNextCentroid(
		centroids: Array<Point>,
		centroidsNumber: number,
		distanceFn: DistanceFunction,
	): Array<Point> {
		if (centroids.length === centroidsNumber) return centroids
		const nextCentroid =
			centroids.length === 0 ? this.randomPoint() : this.getNextCluster(centroids, distanceFn)
		const allCentroids = [...centroids, nextCentroid]
		return this.findNextCentroid(allCentroids, centroidsNumber, distanceFn)
	}

	kmeans(
		centroids: Array<Point>,
		attributions: Array<number>,
		iterations: Array<Iteration>,
		distanceFn: DistanceFunction,
		iteration: number,
		maxIterations: number,
	): { centroids: Array<Point>; attributions: Array<number>; iterations: Array<Iteration> } {
		if (maxIterations === iteration) return { centroids, attributions, iterations }
		const [newAttributions, hasChanged] = this.recalculateAttributions(
			centroids,
			attributions,
			distanceFn,
		)
		if (!hasChanged) return { centroids, attributions, iterations }
		const newCentroids = this.recalculateCentroids(centroids, newAttributions)
		const currentIteration = { centroids: newCentroids, attributions: newAttributions }
		const newIteration = [...iterations, currentIteration]
		return this.kmeans(
			newCentroids,
			newAttributions,
			newIteration,
			distanceFn,
			iteration + 1,
			maxIterations,
		)
	}

	recalculateAttributions(
		centroids: Array<Point>,
		attributions: Array<number>,
		distanceFn: DistanceFunction,
	): [Array<number>, boolean] {
		let hasChanged = false
		const newAttributions = []
		for (let i = 0; i < this.data.length; i++) {
			const point = this.data[i]
			const closestIdx = getClosestPoint(point, centroids, distanceFn)
			const previousAttribution = attributions[i]
			newAttributions.push(closestIdx)
			hasChanged = hasChanged || previousAttribution !== closestIdx
		}
		return [newAttributions, hasChanged]
	}

	recalculateCentroids(centroids: Array<Point>, attributions: Array<number>): Array<Point> {
		const newCentroids = []
		for (let i = 0; i < centroids.length; i++) {
			const attributedIdxs = filterIdxs(attributions, i)
			const points = attributedIdxs.map(i => this.data[i])
			const newCentroid = points.length === 0 ? centroids[i] : clusterCentroid(points)
			newCentroids.push(newCentroid)
		}
		return newCentroids
	}

	clusterize(
		centroidsNumber: number = DEF_CENTROIDS,
		maxIterations: number = DEF_ITERATIONS,
		distanceFn: DistanceFunction = sqDistance,
	): Result {
		if (centroidsNumber === 0 || centroidsNumber >= this.data.length) {
			throw new Error('Wrong number of clusters!')
		}
		const startingCentroids = this.findNextCentroid([], centroidsNumber, distanceFn)
		const startingAttributions = arrayFrom({ length: this.data.length })
		const startingIteration = { centroids: startingCentroids, attributions: startingAttributions }
		const results = this.kmeans(
			startingCentroids,
			startingAttributions,
			[startingIteration],
			distanceFn,
			0,
			maxIterations,
		)
		return results
	}
}

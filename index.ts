import {
	filterIdxs,
	clusterCentroid,
	chooseDistribution,
	sqDistance,
	getClosestPoint,
	Point,
	arrayFrom,
} from './utils'

type Iteration = {
	centroids: Array<Point>
	attributions: Array<number>
}

const DEF_CENTROIDS = 3
const DEF_ITERATIONS = 1e3

class Clusterer {
	data: Array<Point>

	constructor(data: Array<Point>, validate: boolean = true) {
		if (validate && !this.validateData(data)) throw new Error('Data format wrong')
		this.data = data
	}

	isNotPoint(p: Point): boolean {
		return p.length !== 2 || typeof p[0] !== 'number' || typeof p[1] !== 'number'
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

	getNextCluster(centroids: Array<Point>): Point {
		const probabilities = this.data.map(
			(point: Point): number => {
				const distancer = sqDistance(point)
				const distances = centroids.map(distancer)
				return Math.min(...distances)
			},
		)
		const idx = chooseDistribution(probabilities)
		return this.data[idx]
	}

	findNextCentroid(centroids: Array<Point>, centroidsNumber: number): Array<Point> {
		if (centroids.length === centroidsNumber) return centroids
		const nextCentroid =
			centroids.length === 0 ? this.randomPoint() : this.getNextCluster(centroids)
		const allCentroids = [...centroids, nextCentroid]
		return this.findNextCentroid(allCentroids, centroidsNumber)
	}

	kmeans(
		centroids: Array<Point>,
		attributions: Array<number>,
		iterations: Array<Iteration>,
		iteration: number,
		maxIterations: number,
	): { centroids: Array<Point>; attributions: Array<number>; iterations: Array<Iteration> } {
		if (maxIterations === iteration) return { centroids, attributions, iterations }
		const [newAttributions, hasChanged] = this.recalculateAttributions(centroids, attributions)
		if (!hasChanged) return { centroids, attributions, iterations }
		const newCentroids = this.recalculateCentroids(centroids, newAttributions)
		const currentIteration = { centroids: newCentroids, attributions: newAttributions }
		const newIteration = [...iterations, currentIteration]
		return this.kmeans(newCentroids, newAttributions, newIteration, iteration + 1, maxIterations)
	}

	recalculateAttributions(
		centroids: Array<Point>,
		attributions: Array<number>,
	): [Array<number>, boolean] {
		let hasChanged = false
		const newAttributions = []
		for (let i = 0; i < this.data.length; i++) {
			const point = this.data[i]
			const closestIdx = getClosestPoint(point, centroids)
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
			const newCentroid = clusterCentroid(points)
			newCentroids.push(newCentroid)
		}
		return newCentroids
	}

	clusterize(
		centroidsNumber: number = DEF_CENTROIDS,
		maxIterations: number = DEF_ITERATIONS,
	): { result: Iteration; iterations: Array<Iteration> } {
		if (centroidsNumber === 0 || centroidsNumber >= this.data.length) {
			throw new Error('Wrong number of clusters!')
		}
		const startingCentroids = this.findNextCentroid([], centroidsNumber)
		const initialAssignments = arrayFrom({ length: this.data.length })
		const firstIteration = { centroids: startingCentroids, attributions: initialAssignments }
		const { centroids, attributions, iterations } = this.kmeans(
			startingCentroids,
			initialAssignments,
			[firstIteration],
			0,
			maxIterations,
		)
		const result = { centroids, attributions }
		return { result, iterations }
	}
}

module.exports = Clusterer

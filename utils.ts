export type Point = Array<number>
export type Iteration = {
	centroids: Array<Point>
	attributions: Array<number>
}
export type Result = {
	centroids: Array<Point>
	attributions: Array<number>
	iterations: Array<Iteration>
}
export type DistanceFunction = (p1: number[], p2: number[]) => number

type Generator = (val: any, idx: number) => any

function noop() {}

export function sumArray(arr: number[]): number {
	return arr.reduce((a, v) => a + v, 0)
}

export function findMinIdx(arr: number[]): number {
	return arr.reduce((a, v, idx) => (arr[a] < v ? a : idx), 0)
}

export function filterIdxs(arr: number[], val: number): number[] {
	const idxs = []
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === val) idxs.push(i)
	}
	return idxs
}

export function clusterCentroid(cluster: Array<Point>): Point {
	const length = cluster[0].length
	const sums = arrayFrom({ length }, 0)
	for (let i = 0; i < cluster.length; i++) {
		const point = cluster[i]
		for (let j = 0; j < length; j++) {
			sums[j] += point[j]
		}
	}
	return sums.map(sum => sum / cluster.length)
}

export function chooseDistribution(distr: number[]) {
	const total = sumArray(distr)
	const random = Math.random() * total
	let sum = 0
	let idx = 0
	for (idx; idx < distr.length; idx++) {
		sum += distr[idx]
		if (random < sum) break
	}
	return idx
}

export function sqDistance(p1: Point, p2: Point): number {
	const sqDistances = p1.map((_, i: number): number => (p1[i] - p2[i]) * (p1[i] - p2[i]))
	return sumArray(sqDistances)
}

export function getClosestPoint(
	p1: Point,
	pArray: Array<Point>,
	distanceFn: DistanceFunction,
): number {
	const distances = pArray.map(p2 => distanceFn(p1, p2))
	const minIdx = findMinIdx(distances)
	return minIdx
}

export function arrayFrom(
	array: Array<any> | { length: number },
	generator: number | Generator = noop,
): Array<any> {
	const newArray = []
	for (let i = 0; i < array.length; i++) {
		const oldVal = array[i]
		const newVal = typeof generator === 'function' ? generator(oldVal, i) : generator
		newArray.push(newVal)
	}
	return newArray
}

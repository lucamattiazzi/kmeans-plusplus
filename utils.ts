export type Point = [number, number]

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
	const [xSum, ySum] = cluster.reduce(
		(acc, point) => {
			return [acc[0] + point[0], acc[1] + point[1]]
		},
		[0, 0],
	)
	return [xSum / cluster.length, ySum / cluster.length]
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

export function sqDistance(p1: Point): (p: Point) => number {
	return function(p2: Point): number {
		const dx = p1[0] - p2[0]
		const dy = p1[1] - p2[1]
		return dx * dx + dy * dy
	}
}

export function getClosestPoint(p1: Point, pArray: Array<Point>): number {
	const distancer = sqDistance(p1)
	const distances = pArray.map(distancer)
	const minIdx = findMinIdx(distances)
	return minIdx
}

export function arrayFrom(
	array: Array<any> | { length: number },
	generator: (_: any, idx: number) => any = () => undefined,
): Array<any> {
	const newArray = []
	for (let i = 0; i < array.length; i++) {
		const oldVal = array[i]
		newArray.push(generator(oldVal, i))
	}
	return newArray
}

// module.exports = {
// 	filterIdxs,
// 	clusterCentroid,
// 	chooseDistribution,
// 	sqDistance,
// 	getClosestPoint,
// }

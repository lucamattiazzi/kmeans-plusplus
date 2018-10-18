// not a real test!
// also since it's kind of random, not so easy to run a test
const Clusterer = require('./index.js')
const SIDE = 10

const testClusterer = (dimensions, points, clusters) => {
	console.log('--------')
	console.log(
		`RUNNING TEST WITH ${points} ${dimensions}-dimensional points, in ${clusters} clusters.`,
	)
	const generatePoint = () => Array.from({ length: dimensions }, () => Math.random() * SIDE)
	const data = Array.from({ length: points }, generatePoint)

	const clusterer = new Clusterer(data)

	const { centroids, attributions, iterations } = clusterer.clusterize(clusters)

	console.log('points', data)
	console.log('attributions', attributions)
	console.log('centroids', centroids)
	console.log('--------')
}

testClusterer(2, 30, 4)
testClusterer(1, 10, 2)

# kmeans-plusplus

> Kmeans, with a nice starter

This library is:

- Dependency free!
- Typescript!
- Isomorphic!
- Palm oil free!
- Work with multidimensional points (euclidean distance)

## Install

```
$ npm install kmeans-plusplus
```

## Usage

```js
const Clusterer = require('kmeans-plusplus')

const data = [[1, 2], [0, 3], [10, 0], [3, 10], [2, 3], [9, 2]]

const clusterer = new Clusterer(data)

const { centroids, attributions, iterations } = clusterer.clusterize(3)
```

## API

### new Clusterer(data, [validate])

#### data

Type: `<Array<[number, number]>`

Points array

#### validate

Type: `boolean`<br>
Default: `true`

Set to false if you want to skip the data validation(risky!)

### clusterer.clusterize([clusters, maxIterations, distanceFn]) => { centroids, attributions, iterations }

##### clusters

Type: `number`<br>
Default: 3

Number of clusters to create

##### maxIterations

Type: `number`<br>
Default: 1000

Max number of iterations executed if convergence is not achieved

##### distanceFn

Type: `function: (number[], number[]) => number`<br>
Default: `squared euclidean`

```
(p1, p2) => {
  const distances = p1.map((_, i) => (p1[i] - p2[i]) * (p1[i] - p2[i]))
  return distances / p1.length
}
```

Function used to measure distance between points when finding nearest cluster and seeding clusters

##### centroids

Type: `Array<Array<number>>`

Final centroids

##### attributions

Type: `Array<number>`

Array of the indices of the final cluster relative to each starting point

##### iterations

Type: `Array<{ centroids: Array<Array<number>>, attributions: Array<number> }>`

Each iteration of the algorithm, sorted

## License

MIT © [Yeasteregg](https://yegg.it)

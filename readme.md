# kmeans-plusplus

> Kmeans, with a nice starter

This library is:

- Dependency free!
- Typescript!
- Isomorphic!
- Palm oil free!
- Provided with 6 amazing features (TODO)

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

### clusterer.clusterize([clusters, maxIterations])

##### clusters

Type: `number`<br>
Default: 3

Number of clusters to create

##### maxIterations

Type: `number`<br>
Default: 1000

Max number of iterations executed if convergence is not achieved

## License

MIT © [Yeasteregg](https://yegg.it)

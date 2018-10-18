var utils_1 = require('./utils');
var DEF_CENTROIDS = 3;
var DEF_ITERATIONS = 1e3;
var Clusterer = (function () {
    function Clusterer(data, validate) {
        if (validate === void 0) { validate = true; }
        if (validate && !this.validateData(data))
            throw new Error('Data format wrong');
        this.data = data;
    }
    Clusterer.prototype.isNotPoint = function (p) {
        return p.length === 0 || p.some(function (v) { return typeof v !== 'number'; });
    };
    Clusterer.prototype.validateData = function (data) {
        if (data.length === 0)
            return false;
        if (data.some(this.isNotPoint))
            return false;
        return true;
    };
    Clusterer.prototype.randomPoint = function () {
        var idx = Math.floor(Math.random() * this.data.length);
        return this.data[idx];
    };
    Clusterer.prototype.getNextCluster = function (centroids, distanceFn) {
        var probabilities = this.data.map(function (point) {
            var distances = centroids.map(function (centroid) { return distanceFn(point, centroid); });
            return Math.min.apply(Math, distances);
        });
        var idx = utils_1.chooseDistribution(probabilities);
        return this.data[idx];
    };
    Clusterer.prototype.findNextCentroid = function (centroids, centroidsNumber, distanceFn) {
        if (centroids.length === centroidsNumber)
            return centroids;
        var nextCentroid = centroids.length === 0 ? this.randomPoint() : this.getNextCluster(centroids, distanceFn);
        var allCentroids = centroids.concat([nextCentroid]);
        return this.findNextCentroid(allCentroids, centroidsNumber, distanceFn);
    };
    Clusterer.prototype.kmeans = function (centroids, attributions, iterations, distanceFn, iteration, maxIterations) {
        if (maxIterations === iteration)
            return { centroids: centroids, attributions: attributions, iterations: iterations };
        var _a = this.recalculateAttributions(centroids, attributions, distanceFn), newAttributions = _a[0], hasChanged = _a[1];
        if (!hasChanged)
            return { centroids: centroids, attributions: attributions, iterations: iterations };
        var newCentroids = this.recalculateCentroids(centroids, newAttributions);
        var currentIteration = { centroids: newCentroids, attributions: newAttributions };
        var newIteration = iterations.concat([currentIteration]);
        return this.kmeans(newCentroids, newAttributions, newIteration, distanceFn, iteration + 1, maxIterations);
    };
    Clusterer.prototype.recalculateAttributions = function (centroids, attributions, distanceFn) {
        var hasChanged = false;
        var newAttributions = [];
        for (var i = 0; i < this.data.length; i++) {
            var point = this.data[i];
            var closestIdx = utils_1.getClosestPoint(point, centroids, distanceFn);
            var previousAttribution = attributions[i];
            newAttributions.push(closestIdx);
            hasChanged = hasChanged || previousAttribution !== closestIdx;
        }
        return [newAttributions, hasChanged];
    };
    Clusterer.prototype.recalculateCentroids = function (centroids, attributions) {
        var _this = this;
        var newCentroids = [];
        for (var i = 0; i < centroids.length; i++) {
            var attributedIdxs = utils_1.filterIdxs(attributions, i);
            var points = attributedIdxs.map(function (i) { return _this.data[i]; });
            var newCentroid = points.length === 0 ? centroids[i] : utils_1.clusterCentroid(points);
            newCentroids.push(newCentroid);
        }
        return newCentroids;
    };
    Clusterer.prototype.clusterize = function (centroidsNumber, maxIterations, distanceFn) {
        if (centroidsNumber === void 0) { centroidsNumber = DEF_CENTROIDS; }
        if (maxIterations === void 0) { maxIterations = DEF_ITERATIONS; }
        if (distanceFn === void 0) { distanceFn = utils_1.sqDistance; }
        if (centroidsNumber === 0 || centroidsNumber >= this.data.length) {
            throw new Error('Wrong number of clusters!');
        }
        var startingCentroids = this.findNextCentroid([], centroidsNumber, distanceFn);
        var startingAttributions = utils_1.arrayFrom({ length: this.data.length });
        var startingIteration = { centroids: startingCentroids, attributions: startingAttributions };
        var results = this.kmeans(startingCentroids, startingAttributions, [startingIteration], distanceFn, 0, maxIterations);
        return results;
    };
    return Clusterer;
})();
module.exports = Clusterer;

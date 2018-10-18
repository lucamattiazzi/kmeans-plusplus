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
        return p.length !== 2 || p.some(function (v) { return typeof v !== 'number'; });
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
    Clusterer.prototype.getNextCluster = function (centroids) {
        var probabilities = this.data.map(function (point) {
            var distancer = utils_1.sqDistance(point);
            var distances = centroids.map(distancer);
            return Math.min.apply(Math, distances);
        });
        var idx = utils_1.chooseDistribution(probabilities);
        return this.data[idx];
    };
    Clusterer.prototype.findNextCentroid = function (centroids, centroidsNumber) {
        if (centroids.length === centroidsNumber)
            return centroids;
        var nextCentroid = centroids.length === 0 ? this.randomPoint() : this.getNextCluster(centroids);
        var allCentroids = centroids.concat([nextCentroid]);
        return this.findNextCentroid(allCentroids, centroidsNumber);
    };
    Clusterer.prototype.kmeans = function (centroids, attributions, iterations, iteration, maxIterations) {
        if (maxIterations === iteration)
            return { centroids: centroids, attributions: attributions, iterations: iterations };
        var _a = this.recalculateAttributions(centroids, attributions), newAttributions = _a[0], hasChanged = _a[1];
        if (!hasChanged)
            return { centroids: centroids, attributions: attributions, iterations: iterations };
        var newCentroids = this.recalculateCentroids(centroids, newAttributions);
        var currentIteration = { centroids: newCentroids, attributions: newAttributions };
        var newIteration = iterations.concat([currentIteration]);
        return this.kmeans(newCentroids, newAttributions, newIteration, iteration + 1, maxIterations);
    };
    Clusterer.prototype.recalculateAttributions = function (centroids, attributions) {
        var hasChanged = false;
        var newAttributions = [];
        for (var i = 0; i < this.data.length; i++) {
            var point = this.data[i];
            var closestIdx = utils_1.getClosestPoint(point, centroids);
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
            var newCentroid = utils_1.clusterCentroid(points);
            newCentroids.push(newCentroid);
        }
        return newCentroids;
    };
    Clusterer.prototype.clusterize = function (centroidsNumber, maxIterations) {
        if (centroidsNumber === void 0) { centroidsNumber = DEF_CENTROIDS; }
        if (maxIterations === void 0) { maxIterations = DEF_ITERATIONS; }
        if (centroidsNumber === 0 || centroidsNumber >= this.data.length) {
            throw new Error('Wrong number of clusters!');
        }
        var startingCentroids = this.findNextCentroid([], centroidsNumber);
        var initialAssignments = utils_1.arrayFrom({ length: this.data.length });
        var firstIteration = { centroids: startingCentroids, attributions: initialAssignments };
        var _a = this.kmeans(startingCentroids, initialAssignments, [firstIteration], 0, maxIterations), centroids = _a.centroids, attributions = _a.attributions, iterations = _a.iterations;
        var result = { centroids: centroids, attributions: attributions };
        return { result: result, iterations: iterations };
    };
    return Clusterer;
})();
module.exports = Clusterer;

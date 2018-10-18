function noop() { }
function sumArray(arr) {
    return arr.reduce(function (a, v) { return a + v; }, 0);
}
exports.sumArray = sumArray;
function findMinIdx(arr) {
    return arr.reduce(function (a, v, idx) { return (arr[a] < v ? a : idx); }, 0);
}
exports.findMinIdx = findMinIdx;
function filterIdxs(arr, val) {
    var idxs = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val)
            idxs.push(i);
    }
    return idxs;
}
exports.filterIdxs = filterIdxs;
function clusterCentroid(cluster) {
    var length = cluster[0].length;
    var sums = arrayFrom({ length: length }, 0);
    for (var i = 0; i < cluster.length; i++) {
        var point = cluster[i];
        for (var j = 0; j < length; j++) {
            sums[j] += point[j];
        }
    }
    return sums.map(function (sum) { return sum / cluster.length; });
}
exports.clusterCentroid = clusterCentroid;
function chooseDistribution(distr) {
    var total = sumArray(distr);
    var random = Math.random() * total;
    var sum = 0;
    var idx = 0;
    for (idx; idx < distr.length; idx++) {
        sum += distr[idx];
        if (random < sum)
            break;
    }
    return idx;
}
exports.chooseDistribution = chooseDistribution;
function sqDistance(p1, p2) {
    var sqDistances = p1.map(function (_, i) { return (p1[i] - p2[i]) * (p1[i] - p2[i]); });
    return sumArray(sqDistances);
}
exports.sqDistance = sqDistance;
function getClosestPoint(p1, pArray, distanceFn) {
    var distances = pArray.map(function (p2) { return distanceFn(p1, p2); });
    var minIdx = findMinIdx(distances);
    return minIdx;
}
exports.getClosestPoint = getClosestPoint;
function arrayFrom(array, generator) {
    if (generator === void 0) { generator = noop; }
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        var oldVal = array[i];
        var newVal = typeof generator === 'function' ? generator(oldVal, i) : generator;
        newArray.push(newVal);
    }
    return newArray;
}
exports.arrayFrom = arrayFrom;

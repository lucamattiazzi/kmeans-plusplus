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
    var _a = cluster.reduce(function (acc, point) {
        return [acc[0] + point[0], acc[1] + point[1]];
    }, [0, 0]), xSum = _a[0], ySum = _a[1];
    return [xSum / cluster.length, ySum / cluster.length];
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
function sqDistance(p1) {
    return function (p2) {
        var dx = p1[0] - p2[0];
        var dy = p1[1] - p2[1];
        return dx * dx + dy * dy;
    };
}
exports.sqDistance = sqDistance;
function getClosestPoint(p1, pArray) {
    var distancer = sqDistance(p1);
    var distances = pArray.map(distancer);
    var minIdx = findMinIdx(distances);
    return minIdx;
}
exports.getClosestPoint = getClosestPoint;
function arrayFrom(array, generator) {
    if (generator === void 0) { generator = function () { return undefined; }; }
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        var oldVal = array[i];
        newArray.push(generator(oldVal, i));
    }
    return newArray;
}
exports.arrayFrom = arrayFrom;

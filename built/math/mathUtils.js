var PI = 3.14159265359;
function degToRad(deg) {
    return (deg * (PI / 180));
}
function getRandomInRange(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}
function generateTranslation() {
    var minX = -20;
    var maxX = +20;
    var minY = -20;
    var maxY = +20;
    var minZ = -100.0;
    var maxZ = -2.9;
    var x = getRandomInRange(minX, maxX);
    var y = getRandomInRange(minY, maxY);
    var z = getRandomInRange(minZ, maxZ);
    return [x, y, z];
}
function generateRotation() {
    var min = 0.0;
    var max = 359.0;
    var x = getRandomInRange(min, max);
    var y = getRandomInRange(min, max);
    var z = getRandomInRange(min, max);
    return [x, y, z];
}

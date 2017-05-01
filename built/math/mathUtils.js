var PI = 3.14159265359;
function degToRad(deg) {
    return (deg * (PI / 180));
}
function getRandomInRange(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

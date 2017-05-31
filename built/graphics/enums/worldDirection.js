var WorldDirection = {
    UP: [0.0, 1.0, 0.0],
    RIGHT: [1.0, 0.0, 0.0],
    FORWARD: [0.0, 0.0, -1.0]
};
var CoreType = {
    BOOLEAN: 0,
    BYTE: 0,
    UINT8: 0,
    INT8: 1,
    INT16: 2,
    UINT16: 3,
    INT32: 4,
    UINT32: 5,
    FLOAT32: 6,
    FLOAT64: 7
};
function resolveGlSizeType(gl, size) {
    var retVal = undefined;
    switch (size) {
        case CoreType.BYTE:
        case CoreType.UINT8:
        case CoreType.BOOLEAN:
        case CoreType.INT8:
            retVal = gl.BYTE;
            break;
        case CoreType.INT16:
            retVal = gl.SHORT;
            break;
        case CoreType.UINT16:
            retVal = gl.UNSIGNED_SHORT;
            break;
        case CoreType.INT32:
            retVal = gl.INT;
            break;
        case CoreType.UINT32:
            retVal = gl.UNSIGNED_INT;
            break;
        case CoreType.FLOAT32:
        case CoreType.FLOAT64:
            retVal = gl.FLOAT;
            break;
        default:
            throw "";
    }
    return retVal;
}

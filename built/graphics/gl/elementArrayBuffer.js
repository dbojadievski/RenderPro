var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var ElementArrayBuffer = (function () {
                function ElementArrayBuffer(gl) {
                    this.pointer = gl.createBuffer();
                    this.gl = gl;
                }
                ElementArrayBuffer.prototype.bufferData = function (indices) {
                    var gl = this.gl;
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.pointer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                };
                ElementArrayBuffer.prototype.free = function () {
                    this.gl.deleteBuffer(this.pointer);
                };
                return ElementArrayBuffer;
            }());
            gl_1.ElementArrayBuffer = ElementArrayBuffer;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

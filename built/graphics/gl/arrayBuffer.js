var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var ArrayBuffer = (function () {
                function ArrayBuffer(gl) {
                    Application.Debug.assert(isValidReference(gl));
                    this.pointer = gl.createBuffer();
                    this.gl = gl;
                }
                ArrayBuffer.prototype.bufferData = function (vertices) {
                    Application.Debug.assert(isValidReference(vertices));
                    var gl = this.gl;
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                };
                ArrayBuffer.prototype.free = function () {
                    this.gl.deleteBuffer(this.pointer);
                };
                return ArrayBuffer;
            }());
            gl_1.ArrayBuffer = ArrayBuffer;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

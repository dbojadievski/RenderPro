var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var Shader = (function () {
                function Shader() {
                    this.pointer = null;
                }
                Shader.prototype.load = function (shaderSrc, shaderType, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    /* Create the shader */
                    this.pointer = gl.createShader(shaderType);
                    /* Set the source of the shader */
                    gl.shaderSource(this.pointer, shaderSrc);
                    /* Compile the shader */
                    gl.compileShader(this.pointer);
                    if (!gl.getShaderParameter(this.pointer, gl.COMPILE_STATUS)) {
                        alert(gl.getShaderInfoLog(this.pointer));
                        return null;
                    }
                };
                return Shader;
            }());
            gl_1.Shader = Shader;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

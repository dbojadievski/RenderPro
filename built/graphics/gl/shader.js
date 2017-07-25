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
                    Application.Debug.assert(isValidReference(gl));
                    Application.Debug.assert(isValidReference(shaderSrc));
                    Application.Debug.assert(isValidReference(shaderType));
                    var isCreated = false;
                    this.pointer = gl.createShader(shaderType);
                    Application.Debug.assert(this.pointer != -1);
                    if (this.pointer != -1 && this.pointer != null) {
                        gl.shaderSource(this.pointer, shaderSrc);
                        gl.compileShader(this.pointer);
                        if (!gl.getShaderParameter(this.pointer, gl.COMPILE_STATUS))
                            alert(gl.getShaderInfoLog(this.pointer));
                        else
                            isCreated = true;
                    }
                    return isCreated;
                };
                return Shader;
            }());
            gl_1.Shader = Shader;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

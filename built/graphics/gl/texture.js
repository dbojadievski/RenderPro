var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var Texture = (function () {
                function Texture(gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    Application.Debug.assert(isValidReference(gl));
                    this.gl = gl;
                    this.texture = gl.createTexture();
                    if (Texture._currentTextureID == undefined)
                        Texture._currentTextureID = 1;
                    this.textureID = Texture._currentTextureID++;
                }
                Texture.prototype.load = function (image) {
                    Application.Debug.assert(isValidReference(image));
                    var gl = this.gl;
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                };
                Texture.prototype.loadFloatTexture = function (data, width, height) {
                    Application.Debug.assert(isValidReference(data));
                    Application.Debug.assert(width > 0 && height > 0);
                    var gl = this.gl;
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, data);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                };
                Texture.prototype.loadByteTexture = function (data, width, height) {
                    Application.Debug.assert(isValidReference(data));
                    Application.Debug.assert(width > 0 && height > 0);
                    var gl = this.gl;
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                };
                Texture.prototype.unload = function () {
                    var gl = renderPro.graphics.gl.context;
                    gl.deleteTexture(this.texture);
                };
                return Texture;
            }());
            gl_1.Texture = Texture;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

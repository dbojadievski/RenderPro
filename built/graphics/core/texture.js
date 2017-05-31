var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Texture = (function () {
                function Texture(src) {
                    if (src === void 0) { src = null; }
                    var self = this;
                    this.image = new Image();
                    this.image.crossOrigin = "";
                    this.innerTexture = new renderPro.graphics.gl.Texture();
                    this.image.onload = function texture_loaded() {
                        self.innerTexture.load(self.image);
                    };
                    if (src !== null)
                        this.image.src = src;
                    if (Texture._currentTextureID == undefined)
                        Texture._currentTextureID = 1;
                    this.textureID = Texture._currentTextureID;
                }
                Texture.prototype.unload = function () {
                    this.innerTexture.unload();
                };
                Texture.prototype.load = function (data, type, width, height) {
                    var asTypedArray = null;
                    switch (type) {
                        case CoreType.BYTE:
                        case CoreType.UINT8:
                            asTypedArray = new Uint8Array(data);
                            this.innerTexture.loadFloatTexture(asTypedArray, width, height);
                            break;
                        case CoreType.INT16:
                            asTypedArray = new Int16Array(data);
                            break;
                        case CoreType.UINT16:
                            asTypedArray = new Uint16Array(data);
                            break;
                        case CoreType.FLOAT32:
                            asTypedArray = new Float32Array(data);
                            this.innerTexture.loadFloatTexture(asTypedArray, width, height);
                            break;
                        case CoreType.FLOAT64:
                            asTypedArray = new Float64Array(data);
                            break;
                    }
                };
                Texture.prototype.getTexPointer = function () {
                    return this.innerTexture.texture;
                };
                return Texture;
            }());
            core.Texture = Texture;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

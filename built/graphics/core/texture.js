var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Texture = (function () {
                function Texture(src) {
                    var self = this;
                    this.image = new Image();
                    this.image.crossOrigin = "";
                    this.innerTexture = new renderPro.graphics.gl.Texture();
                    this.image.onload = function texture_loaded() {
                        self.innerTexture.load(self.image);
                    };
                    this.image.src = src;
                    if (Texture._currentTextureID == undefined)
                        Texture._currentTextureID = 1;
                    this.textureID = Texture._currentTextureID;
                    // document.body.appendChild ( this.image ); /* Uncomment to view texture for debugging. */ 
                }
                Texture.prototype.unload = function () {
                    this.innerTexture.unload();
                };
                ;
                return Texture;
            }());
            core.Texture = Texture;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

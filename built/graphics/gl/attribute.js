var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var Attribute = (function () {
                function Attribute(name, type, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    this.name = name;
                    this.type = type;
                    this.gl = gl;
                }
                Attribute.prototype.updateLocation = function (effect) {
                    this.location = this.gl.getAttribLocation(effect.programPointer, this.name);
                };
                Attribute.prototype.enable = function () {
                    this.gl.enableVertexAttribArray(this.location);
                };
                Attribute.prototype.disable = function () {
                    this.gl.disableVertexAttribArray(this.location);
                };
                return Attribute;
            }());
            gl_1.Attribute = Attribute;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

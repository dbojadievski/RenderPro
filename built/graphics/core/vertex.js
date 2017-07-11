var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Vertex = (function () {
                function Vertex(position, uv, normal) {
                    if (uv === void 0) { uv = new Float32Array([]); }
                    if (normal === void 0) { normal = new Int16Array([]); }
                    this.position = position;
                    this.uv = uv;
                    this.normal = normal;
                }
                Vertex.prototype.getSize = function () {
                    var size = 0;
                    if (this.position !== undefined)
                        size += this.position.length;
                    if (this.uv !== undefined)
                        size += this.uv.length;
                    if (this.normal !== undefined)
                        size += this.normal.length;
                    return size;
                };
                Vertex.prototype.getBuffer = function () {
                    var buffer = [];
                    if (this.position !== undefined)
                        buffer = buffer.concat(this.position);
                    return buffer;
                };
                return Vertex;
            }());
            core.Vertex = Vertex;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Mesh = (function () {
                function Mesh(vertices, vertexSize, indices, indexSize) {
                    this.vertices = vertices;
                    this.vertexSize = vertexSize;
                    this.vertexCount = vertices.length;
                    this.indices = indices;
                    this.indexSize = indexSize;
                    this.indexCount = indices.length;
                }
                return Mesh;
            }());
            core.Mesh = Mesh;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

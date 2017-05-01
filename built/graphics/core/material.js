var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Material = (function () {
                function Material(ambient, diffuse, specular, shininess) {
                    this.ambient = ambient;
                    this.diffuse = diffuse;
                    this.specular = specular;
                    this.shininess = shininess;
                }
                return Material;
            }());
            core.Material = Material;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

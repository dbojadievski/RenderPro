var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var rendering;
        (function (rendering) {
            var RenderSet = (function () {
                function RenderSet(transparent, opaque) {
                    if (transparent === void 0) { transparent = []; }
                    if (opaque === void 0) { opaque = []; }
                    Application.Debug.assert(isValidReference(opaque));
                    Application.Debug.assert(isValidReference(transparent));
                    this.opaque = opaque;
                    this.transparent = transparent;
                }
                return RenderSet;
            }());
            rendering.RenderSet = RenderSet;
        })(rendering = graphics.rendering || (graphics.rendering = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

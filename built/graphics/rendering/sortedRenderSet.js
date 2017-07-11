var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var rendering;
        (function (rendering) {
            var SortedRenderSet = (function () {
                function SortedRenderSet(transparent, opaque) {
                    if (transparent === void 0) { transparent = new Dictionary(); }
                    if (opaque === void 0) { opaque = new Dictionary(); }
                    this.opaque = opaque;
                    this.transparent = transparent;
                }
                return SortedRenderSet;
            }());
            rendering.SortedRenderSet = SortedRenderSet;
        })(rendering = graphics.rendering || (graphics.rendering = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

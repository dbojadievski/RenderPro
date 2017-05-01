var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var rendering;
        (function (rendering) {
            var RenderSet = (function () {
                function RenderSet(renderables, instances) {
                    this.instances = instances;
                    this.renderables = renderables;
                }
                return RenderSet;
            }());
            rendering.RenderSet = RenderSet;
        })(rendering = graphics.rendering || (graphics.rendering = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

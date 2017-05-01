var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var rendering;
        (function (rendering) {
            var RenderableInstance = (function () {
                function RenderableInstance(renderable, sceneNode) {
                    this.renderable = renderable;
                    this.sceneNode = sceneNode;
                }
                return RenderableInstance;
            }());
            rendering.RenderableInstance = RenderableInstance;
        })(rendering = graphics.rendering || (graphics.rendering = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

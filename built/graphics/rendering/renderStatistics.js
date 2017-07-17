var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var rendering;
        (function (rendering) {
            var RenderingStatistics = (function () {
                function RenderingStatistics() {
                    this.textureSwitches = 0;
                    this.programSwitches = 0;
                    this.timestamp = Date.now();
                }
                RenderingStatistics.prototype.updateFrame = function () {
                    var now = Date.now();
                    this.durationLastFrame = this.timestamp > 0 ? now - this.timestamp : -1;
                    this.fps = 1000 / this.durationLastFrame;
                    this.timestamp = now;
                    this.element.innerHTML = this.durationLastFrame + " ms, "
                        + this.fps + " fps, "
                        + this.programSwitches + " program switches, "
                        + this.textureSwitches + " texture switches, "
                        + this.drawCalls + " draw calls on "
                        + this.rendererName;
                    this.textureSwitches = 0;
                    this.programSwitches = 0;
                };
                return RenderingStatistics;
            }());
            rendering.RenderingStatistics = RenderingStatistics;
        })(rendering = graphics.rendering || (graphics.rendering = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var systems;
        (function (systems) {
            var RenderStatistics = (function () {
                function RenderStatistics(element) {
                    this.rendererName = "";
                    this.element = element;
                    this.drawCalls = 0;
                    this.textureSwitches = 0;
                    this.programSwitches = 0;
                }
                RenderStatistics.prototype.init = function () {
                    this.resetValues();
                };
                RenderStatistics.prototype.update = function () {
                    this.setHtml();
                };
                RenderStatistics.prototype.setValues = function () {
                    var currentTime = Date.now();
                    this.durationLastFrame = currentTime - this.timeLastFrame;
                };
                RenderStatistics.prototype.resetValues = function () {
                    this.timeLastFrame = Date.now();
                    this.drawCalls = 0;
                    this.textureSwitches = 0;
                    this.programSwitches = 0;
                };
                RenderStatistics.prototype.setHtml = function () {
                    Application.Debug.assert(this.element != undefined);
                    this.fps = Math.round(1000 / (Date.now() - this.timeLastFrame));
                    this.element.innerHTML = "" +
                        this.durationLastFrame + " ms, " +
                        Math.floor(this.fps) + " fps, " +
                        this.drawCalls + " drawCalls, " +
                        this.textureSwitches + " texture switches, " +
                        this.programSwitches + " program switches " +
                        " on " + this.rendererName;
                };
                return RenderStatistics;
            }());
            systems.RenderStatistics = RenderStatistics;
        })(systems = core.systems || (core.systems = {}));
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

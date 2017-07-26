var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var systems;
        (function (systems) {
            var RenderStatistics = (function () {
                function RenderStatistics(element, eventSystem) {
                    this.rendererName = "";
                    this.m_domNode = element;
                    this.drawCalls = 0;
                    this.textureSwitches = 0;
                    this.programSwitches = 0;
                    this.m_eventSystem = eventSystem;
                    this.m_repository = new Dictionary();
                }
                RenderStatistics.prototype.init = function () {
                    var self = this;
                    this.m_eventSystem.on('frameRendered', function (stat) {
                        RenderStatistics.handleFrameRendered(stat, self);
                    });
                };
                RenderStatistics.prototype.update = function () {
                    this.setHtml();
                };
                RenderStatistics.prototype.setValues = function () {
                    var currentTime = Date.now();
                    this.durationLastFrame = (currentTime - this.timeLastFrame);
                };
                RenderStatistics.prototype.setHtml = function () {
                    Application.Debug.assert(this.m_domNode != undefined);
                    var msPart = (this.timeLastFrame == 0 ? "Less than 1 ms " : (this.timeLastFrame + " ms "));
                    this.m_domNode.innerHTML = "" +
                        msPart +
                        this.drawCalls + " drawCalls, " +
                        this.textureSwitches + " texture switches, " +
                        this.programSwitches + " program switches " +
                        " on " + this.rendererName;
                };
                RenderStatistics.handleFrameRendered = function (stat, caller) {
                    Application.Debug.assert(isValidReference(stat));
                    var frameTime = new KeyValuePair("frameTime", stat.m_frameTime);
                    caller.m_repository.set(frameTime);
                    var drawCalls = new KeyValuePair("numDrawCalls", stat.m_numDrawCalls);
                    caller.m_repository.set(drawCalls);
                    var progSwitches = new KeyValuePair("numProgramSwitches", stat.m_numProgramSwitches);
                    caller.m_repository.set(progSwitches);
                    var textSwitches = new KeyValuePair("numTextureSwitches", stat.m_numTextureSwitches);
                    caller.m_repository.set(textSwitches);
                    var renderer = new KeyValuePair("rendererName", stat.m_rendererName);
                    caller.m_repository.set(renderer);
                    caller.timeLastFrame = caller.durationLastFrame;
                    caller.durationLastFrame = stat.m_frameTime;
                    caller.drawCalls = stat.m_numDrawCalls;
                    caller.programSwitches = stat.m_numProgramSwitches;
                    caller.textureSwitches = stat.m_numTextureSwitches;
                    caller.rendererName = renderer.value;
                };
                return RenderStatistics;
            }());
            systems.RenderStatistics = RenderStatistics;
        })(systems = core.systems || (core.systems = {}));
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

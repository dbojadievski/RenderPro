var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var Engine = (function () {
            function Engine(assets) {
                this.assets = assets;
            }
            Engine.prototype.init = function () {
                var self = this;
                // let canvas : HTMLCanvasElement  = document.getElementById ( "canvas" ) as HTMLCanvasElement;
                var statsElement = document.getElementById('lblPerformance');
                var canvas = document.getElementById("canvas");
                var glContext = canvas.getContext("experimental-webgl");
                var viewportWidth = canvas.width;
                var viewportHeight = canvas.height;
                this.renderStats = new renderPro.core.systems.RenderStatistics(statsElement);
                this.assetManager = new renderPro.core.systems.AssetManager(this.assets, this.renderStats);
                this.renderer = new renderPro.core.systems.renderers.WebGLRenderer(glContext, viewportWidth, viewportHeight, this.assetManager, Application.Systems.eventSystem, this.renderStats);
                this.systems = [Application.Systems.eventSystem, this.assetManager, this.renderStats];
                for (var systemIdx = 0; systemIdx < this.systems.length; systemIdx++) {
                    this.systems[systemIdx].init();
                }
                // Note(Martin): The renderer has to wait for all the resources to be loaded before initializing
                Application.Systems.eventSystem.on("resourcesLoaded", function () {
                    self.renderer.init();
                    self.systems.push(self.renderer);
                });
            };
            Engine.prototype.update = function () {
                for (var systemIdx = 0; systemIdx < this.systems.length; systemIdx++) {
                    this.systems[systemIdx].update();
                }
            };
            Engine.prototype.start = function () {
                var self = this;
                Application.Systems.eventSystem.on("resourcesLoaded", function () {
                    Application.Systems.console.parseCommand('addIntegers 2 3', true);
                    self.update();
                    (function animloop() {
                        requestAnimationFrame(animloop);
                        self.update();
                    })();
                });
            };
            return Engine;
        }());
        core.Engine = Engine;
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

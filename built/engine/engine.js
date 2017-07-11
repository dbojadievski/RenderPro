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
                Application.Systems.eventSystem = new Application.Infrastructure.ProEventSystem();
                this.assetManager = new renderPro.core.systems.AssetManager(this.assets);
                this.renderer = new renderPro.core.systems.renderers.WebGLRenderer(this.assetManager, Application.Systems.eventSystem);
                this.systems = [Application.Systems.eventSystem, this.assetManager];
                for (var systemIdx = 0; systemIdx < this.systems.length; systemIdx++) {
                    this.systems[systemIdx].init();
                }
                Application.Systems.eventSystem.on("wexBimLoaded", function () {
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
                Application.Systems.eventSystem.on("wexBimLoaded", function () {
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

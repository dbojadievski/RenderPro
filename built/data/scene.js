var renderPro;
(function (renderPro) {
    var data;
    (function (data) {
        var scene;
        (function (scene) {
            var Scene = (function () {
                function Scene() {
                    this.nodes = new renderPro.data.scene.SceneNode(null);
                    this.lights =
                        {
                            pointLights: [],
                            spotLights: [],
                            directionalLights: []
                        };
                    this.cameras = [];
                }
                Scene.prototype.addNode = function (sceneNode) {
                    Application.Debug.assert(sceneNode instanceof renderPro.data.scene.SceneNode, "Invalid param: arg 'sceneNode' not an instanc of SceneNode.");
                    this.nodes.addChild(sceneNode);
                };
                Scene.prototype.addLight = function (light) {
                    Application.Debug.assert(light instanceof renderPro.graphics.scene.lighting.SpotLight || light instanceof renderPro.graphics.scene.lighting.DirectionalLight || light instanceof renderPro.graphics.scene.lighting.PointLight, "Invalid argument: arg 'light' not an instance of any light classes.");
                    if (light instanceof renderPro.graphics.scene.lighting.SpotLight)
                        this.lights.spotLights.push(light);
                    else if (light instanceof renderPro.graphics.scene.lighting.DirectionalLight)
                        this.lights.directionalLights.push(light);
                    else if (light instanceof renderPro.graphics.scene.lighting.PointLight)
                        this.lights.pointLights.push(light);
                };
                Scene.prototype.addCamera = function (camera) {
                    Application.Debug.assert(camera instanceof renderPro.graphics.scene.Camera, "Invalid argument: arg 'camera' not an instance of 'Camera'.");
                    this.cameras.push(camera);
                };
                return Scene;
            }());
            scene.Scene = Scene;
        })(scene = data.scene || (data.scene = {}));
    })(data = renderPro.data || (renderPro.data = {}));
})(renderPro || (renderPro = {}));

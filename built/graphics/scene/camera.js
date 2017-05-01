var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var scene;
        (function (scene) {
            var Camera = (function () {
                function Camera(position, viewDirection) {
                    this.position = position;
                    this.viewDirection = viewDirection;
                }
                Camera.prototype.getViewMatrix = function (worldUp) {
                    var viewMatrix = mat4.create();
                    var lookAtPoint = new Float32Array([
                        this.position[0] + this.viewDirection[0],
                        this.position[1] + this.viewDirection[1],
                        this.position[2] + this.viewDirection[2]
                    ]);
                    viewMatrix = mat4.lookAt(mat4.create(), this.position, lookAtPoint, worldUp);
                    return viewMatrix;
                };
                ;
                return Camera;
            }());
            scene.Camera = Camera;
        })(scene = graphics.scene || (graphics.scene = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

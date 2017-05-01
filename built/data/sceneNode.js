var renderPro;
(function (renderPro) {
    var data;
    (function (data) {
        var scene;
        (function (scene) {
            var SceneNode = (function () {
                function SceneNode(parent) {
                    this.parent = parent;
                    this.children = [];
                    this.preXYZ = vec3.fromValues(0.0, 0.0, 0.0);
                    this.prePYR = vec3.fromValues(0.0, 0.0, 0.0);
                    this.transform = mat4.create();
                    mat4.identity(this.transform);
                    this.cachedTransform = mat4.create();
                    if (parent instanceof SceneNode)
                        parent.addChild(this);
                }
                SceneNode.prototype.addChild = function (child) {
                    Application.Debug.assert(child instanceof SceneNode, "Invalid argument: arg 'child' not an instance of SceneNode.");
                    this.children.push(child);
                    child.parent = this;
                };
                ;
                /*
                * Updates only this node's transformation matrix, based on the pre-transform values.
                * It resets the pre-transform values to the defaults afterwards.
                * Note(Dino):
                * The defaults are nil vectors.
                */
                SceneNode.prototype.updateLocal = function () {
                    mat4.rotateX(this.transform, this.transform, this.prePYR[2]);
                    mat4.rotateY(this.transform, this.transform, this.prePYR[1]);
                    mat4.rotateZ(this.transform, this.transform, this.prePYR[0]);
                    mat4.translate(this.transform, this.transform, this.preXYZ);
                    this.prePYR[0] = 0.0;
                    this.prePYR[1] = 0.0;
                    this.prePYR[2] = 0.0;
                    this.preXYZ[0] = 0.0;
                    this.preXYZ[1] = 0.0;
                    this.preXYZ[2] = 0.0;
                    this.cachedTransform = this.computeTransform();
                };
                SceneNode.prototype.computeTransform = function () {
                    var finalTransform = mat4.create();
                    mat4.identity(finalTransform);
                    mat4.multiply(finalTransform, finalTransform, this.transform);
                    var parent = this.parent;
                    while (parent !== null) {
                        mat4.multiply(finalTransform, finalTransform, parent.transform);
                        parent = parent.parent;
                    }
                    return finalTransform;
                };
                SceneNode.prototype.updateAll = function () {
                    this.updateLocal();
                    for (var currChildIdx = 0; currChildIdx < this.children.length; currChildIdx++)
                        this.children[currChildIdx].updateAll();
                };
                ;
                return SceneNode;
            }());
            scene.SceneNode = SceneNode;
        })(scene = data.scene || (data.scene = {}));
    })(data = renderPro.data || (renderPro.data = {}));
})(renderPro || (renderPro = {}));

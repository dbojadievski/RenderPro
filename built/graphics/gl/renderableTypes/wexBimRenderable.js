//NOTE(Dino): Custom-designed renderable type, used only on wexBIM files.
var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var WexBIMRenderable = (function () {
                function WexBIMRenderable(wexHandle, texture, material, state, effect) {
                    this.wexHandle = wexHandle;
                    this.effect = effect;
                    this.texture = texture;
                    this.material = material;
                    this.state = state;
                    this.renderableID = s_RenderableIdentifier++;
                }
                WexBIMRenderable.prototype.bufferData = function (gl) {
                    //NOTE(Dino): At this point, the wexBIM model handle must be entirely loaded.
                    this.wexHandle._gl = gl;
                    this.wexHandle.feedGPU();
                };
                WexBIMRenderable.prototype.unload = function () {
                    //NOTE(Dino): Make sure none of these buffers are currently bound!
                    this.wexHandle._gl.deleteBuffer(this.wexHandle.normalBuffer);
                    this.wexHandle._gl.deleteBuffer(this.wexHandle.indexBuffer);
                    this.wexHandle._gl.deleteBuffer(this.wexHandle.productBuffer);
                    this.wexHandle._gl.deleteBuffer(this.wexHandle.styleBuffer);
                    this.wexHandle._gl.deleteBuffer(this.wexHandle.stateBuffer);
                    this.wexHandle._gl.deleteBuffer(this.wexHandle.transformationBuffer);
                    //NOTE(Dino): Make sure none of these textures are currently bound, also!
                    this.wexHandle._gl.deleteTexture(this.wexHandle.vertexTexture);
                    this.wexHandle._gl.deleteTexture(this.wexHandle.matrixTexture);
                    this.wexHandle._gl.deleteTexture(this.wexHandle.styleBuffer);
                    this.wexHandle._gl.deleteTexture(this.wexHandle.stateStyleTexture);
                };
                WexBIMRenderable.prototype.draw = function (shaderProgram, gl) {
                    this.wexHandle._gl = gl;
                    shaderProgram.use(gl);
                    this.wexHandle.draw();
                };
                WexBIMRenderable.prototype.drawWithoutStateChanges = function (shaderProgram, gl) {
                    //TODO(Dino): Update attributes. Found in the effect.
                    this.wexHandle.draw();
                };
                WexBIMRenderable.prototype.drawUnindexed = function (shaderProgram, gl) {
                    this.wexHandle.drawProducts(gl, 2);
                };
                return WexBIMRenderable;
            }());
            gl_1.WexBIMRenderable = WexBIMRenderable;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

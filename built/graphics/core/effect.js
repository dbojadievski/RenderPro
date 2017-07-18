var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Effect = (function () {
                function Effect(name) {
                    this.name = name;
                    this.innerEffect = new renderPro.graphics.gl.Effect();
                    if (Effect.currentEffectIdx == undefined)
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;
                    this.effectID = Effect.currentEffectIdx;
                }
                Effect.prototype.load = function (vertexShaderObject, fragmentShaderObject) {
                    this.innerEffect.load(vertexShaderObject, fragmentShaderObject);
                };
                Effect.prototype.use = function () {
                    this.innerEffect.use();
                };
                return Effect;
            }());
            core.Effect = Effect;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

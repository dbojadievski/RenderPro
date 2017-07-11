var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Effect = (function () {
                function Effect(name, vertexShaderObject, fragmentShaderObject) {
                    this.vertexShaderId = vertexShaderObject.id;
                    this.fragmentShaderId = fragmentShaderObject.id;
                    this.name = name;
                    this.innerEffect = new renderPro.graphics.gl.Effect(vertexShaderObject, fragmentShaderObject);
                    if (Effect.currentEffectIdx == undefined)
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;
                    this.effectID = Effect.currentEffectIdx;
                }
                Effect.prototype.use = function () {
                    this.innerEffect.use();
                };
                return Effect;
            }());
            core.Effect = Effect;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var Effect = (function () {
            function Effect(vertexShader, fragmentShader, gl) {
                this.uniforms = [];
                this.attributes = [];
                this.vertexShader = vertexShader;
                this.fragmentShader = fragmentShader;
                this.programPointer = gl.createProgram();
                if (Effect.currentEffectIdx == undefined)
                    Effect.currentEffectIdx = 1;
                else
                    Effect.currentEffectIdx++;
                this.effectID = Effect.currentEffectIdx;
                gl.attachShader(this.programPointer, this.vertexShader);
                gl.attachShader(this.programPointer, this.fragmentShader);
                gl.linkProgram(this.programPointer);
            }
            Effect.prototype.use = function (gl) {
                gl.useProgram(this.programPointer);
            };
            return Effect;
        }());
        graphics.Effect = Effect;
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

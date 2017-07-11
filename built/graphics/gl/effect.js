var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var Effect = (function () {
                function Effect(vertexShaderObject, fragmentShaderObject, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    this.uniforms = {};
                    this.attributes = {};
                    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
                    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(this.vertexShader, vertexShaderObject.content);
                    gl.shaderSource(this.fragmentShader, fragmentShaderObject.content);
                    gl.compileShader(this.vertexShader);
                    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
                        alert(gl.getShaderInfoLog(this.vertexShader));
                        return null;
                    }
                    gl.compileShader(this.fragmentShader);
                    if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
                        alert(gl.getShaderInfoLog(this.fragmentShader));
                        return null;
                    }
                    this.programPointer = gl.createProgram();
                    gl.attachShader(this.programPointer, this.vertexShader);
                    gl.attachShader(this.programPointer, this.fragmentShader);
                    gl.linkProgram(this.programPointer);
                    if (!gl.getProgramParameter(this.programPointer, gl.LINK_STATUS)) {
                        alert("Could not initialise shaders");
                        return null;
                    }
                    var typesMapping = {
                        "int": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1I,
                        "float": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1F,
                        "vec2": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_2FV,
                        "vec3": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_3FV,
                        "vec4": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_4FV,
                        "mat2": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_MATRIX_2FV,
                        "mat3": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_MATRIX_3FV,
                        "mat4": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_MATRIX_4FV,
                        "sampler2D": renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1I
                    };
                    // TODO(Martin): Add defaultValue from fragment shader if uniform is already set
                    for (var i = 0; i < vertexShaderObject.uniforms.length; i++) {
                        var uniform = vertexShaderObject.uniforms[i];
                        var type = typesMapping[uniform.type];
                        this.uniforms[uniform.name] = new renderPro.graphics.gl.Uniform(uniform.name, typesMapping[uniform.type], gl);
                    }
                    for (var i = 0; i < fragmentShaderObject.uniforms.length; i++) {
                        var uniform = fragmentShaderObject.uniforms[i];
                        var type = typesMapping[uniform.type];
                        if (!this.uniforms[uniform.name]) {
                            this.uniforms[uniform.name] = new renderPro.graphics.gl.Uniform(uniform.name, typesMapping[uniform.type], gl);
                        }
                    }
                    for (var name in this.uniforms) {
                        // skip loop if the property is from prototype
                        if (!this.uniforms.hasOwnProperty(name))
                            continue;
                        this.uniforms[name].init(this);
                    }
                    // TODO
                    for (var i = 0; i < vertexShaderObject.attributes.length; i++) {
                        var attribute = vertexShaderObject.attributes[i];
                        var type = typesMapping[attribute.type];
                        this.attributes[attribute.name] = new renderPro.graphics.gl.Attribute(attribute.name, attribute.type, gl);
                    }
                    for (var i = 0; i < fragmentShaderObject.attributes.length; i++) {
                        var attribute = fragmentShaderObject.attributes[i];
                        var type = typesMapping[attribute.type];
                        if (!this.attributes[attribute.name]) {
                            this.attributes[attribute.name] = new renderPro.graphics.gl.Attribute(attribute.name, attribute.type, gl);
                        }
                    }
                    for (var attrName in this.attributes) {
                        if (this.attributes.hasOwnProperty(attrName)) {
                            this.attributes[attrName].updateLocation(this);
                            this.attributes[attrName].enable();
                        }
                    }
                    // this.attributes[ "vertexNormal" ].updateLocation();
                    // this.attributes[ "vertexPosition" ].updateLocation();
                    // this.attributes[ "vertexTextureCoordinate" ].updateLocation();
                    // this.attributes[ "vertexNormal" ].enable();
                    // this.attributes[ "vertexPosition" ].enable();
                    // this.attributes[ "vertexTextureCoordinate" ].enable();
                    if (Effect.currentEffectIdx == undefined)
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;
                    this.effectID = Effect.currentEffectIdx;
                }
                Effect.prototype.use = function (gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    gl.useProgram(this.programPointer);
                };
                return Effect;
            }());
            gl_1.Effect = Effect;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

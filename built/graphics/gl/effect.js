var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var Effect = (function () {
                function Effect() {
                    this.uniforms = {};
                    this.attributes = {};
                    this.vertexShader = new renderPro.graphics.gl.Shader();
                    this.fragmentShader = new renderPro.graphics.gl.Shader();
                }
                Effect.prototype.load = function (vertexShaderObject, fragmentShaderObject, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    this.vertexShader.load(vertexShaderObject.content, gl.VERTEX_SHADER);
                    this.fragmentShader.load(fragmentShaderObject.content, gl.FRAGMENT_SHADER);
                    /* Create a shader program and attach the vertex and fragment shader to this program */
                    this.programPointer = gl.createProgram();
                    gl.attachShader(this.programPointer, this.vertexShader.pointer);
                    gl.attachShader(this.programPointer, this.fragmentShader.pointer);
                    gl.linkProgram(this.programPointer);
                    if (!gl.getProgramParameter(this.programPointer, gl.LINK_STATUS)) {
                        alert("Could not initialise shaders");
                        return null;
                    }
                    this.use(gl);
                    this.loadUniforms(vertexShaderObject.uniforms, fragmentShaderObject.uniforms, gl);
                    this.loadAttributes(vertexShaderObject.attributes, fragmentShaderObject.attributes, gl);
                    /* Give this effect a unique id */
                    if (Effect.currentEffectIdx == undefined)
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;
                    this.effectID = Effect.currentEffectIdx;
                };
                Effect.prototype.use = function (gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    gl.useProgram(this.programPointer);
                };
                /* NOTE(Martin): The following method requires the current program letiable on the gl context object to be set to this program */
                Effect.prototype.loadUniforms = function (vertexUniforms, fragmentUniforms, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    /* Create uniform objects for vertex shader */
                    var uniformDefaults = {};
                    for (var i = 0; i < vertexUniforms.length; i++) {
                        var uniform = vertexUniforms[i];
                        this.uniforms[uniform.name] = new renderPro.graphics.gl.Uniform(uniform.name, uniform.type, gl);
                        if (uniform.defaultValue != undefined)
                            uniformDefaults[uniform.name] = uniform.defaultValue;
                    }
                    /* Create uniform objects for fragment shader */
                    for (var i = 0; i < fragmentUniforms.length; i++) {
                        var uniform = fragmentUniforms[i];
                        if (!this.uniforms[uniform.name]) {
                            this.uniforms[uniform.name] = new renderPro.graphics.gl.Uniform(uniform.name, uniform.type, gl);
                        }
                        if (uniform.defaultValue != undefined)
                            uniformDefaults[uniform.name] = uniform.defaultValue;
                    }
                    /* Initiate uniform objects and set defaults if available */
                    for (var name_1 in this.uniforms) {
                        // skip loop if the property is from prototype
                        if (!this.uniforms.hasOwnProperty(name_1))
                            continue;
                        this.uniforms[name_1].init(this);
                        if (uniformDefaults[name_1] != undefined) {
                            this.uniforms[name_1].set(uniformDefaults[name_1]);
                        }
                    }
                };
                Effect.prototype.loadAttributes = function (vertexAttribute, fragmentAttribute, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    /* Create attribute objects for vertex shader */
                    for (var i = 0; i < vertexAttribute.length; i++) {
                        var attribute = vertexAttribute[i];
                        this.attributes[attribute.name] = new renderPro.graphics.gl.Attribute(attribute.name, attribute.type, gl);
                    }
                    /* Create attribute objects for fragment shader */
                    for (var i = 0; i < fragmentAttribute.length; i++) {
                        var attribute = fragmentAttribute[i];
                        if (!this.attributes[attribute.name]) {
                            this.attributes[attribute.name] = new renderPro.graphics.gl.Attribute(attribute.name, attribute.type, gl);
                        }
                    }
                    /* Initiate each attribute */
                    for (var attrName in this.attributes) {
                        if (this.attributes.hasOwnProperty(attrName)) {
                            this.attributes[attrName].updateLocation(this);
                            this.attributes[attrName].enable();
                        }
                    }
                };
                return Effect;
            }());
            gl_1.Effect = Effect;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

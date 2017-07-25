var versionNumber = "0.1a";
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
                    Application.Debug.assert(isValidReference(vertexShaderObject));
                    Application.Debug.assert(isValidReference(fragmentShaderObject));
                    Application.Debug.assert(isValidReference(gl));
                    var isLoaded = false;
                    if (isValidReference(vertexShaderObject) && isValidReference(fragmentShaderObject != null)) {
                        this.vertexShader.load(vertexShaderObject.content, gl.VERTEX_SHADER);
                        this.fragmentShader.load(fragmentShaderObject.content, gl.FRAGMENT_SHADER);
                        this.programPointer = gl.createProgram();
                        if (this.programPointer != -1) {
                            gl.attachShader(this.programPointer, this.vertexShader.pointer);
                            gl.attachShader(this.programPointer, this.fragmentShader.pointer);
                            gl.linkProgram(this.programPointer);
                            if (!gl.getProgramParameter(this.programPointer, gl.LINK_STATUS))
                                alert("Could not initialise shaders");
                            else {
                                this.use(gl);
                                this.loadUniforms(vertexShaderObject.uniforms, fragmentShaderObject.uniforms, gl);
                                this.loadAttributes(vertexShaderObject.attributes, gl);
                                isLoaded = true;
                            }
                        }
                    }
                    /* Give this effect a unique id */
                    if (Effect.currentEffectIdx == undefined)
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;
                    this.effectID = Effect.currentEffectIdx;
                    return isLoaded;
                };
                Effect.prototype.use = function (gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    Application.Debug.assert(isValidReference(gl));
                    if (gl != null)
                        gl.useProgram(this.programPointer);
                };
                Effect.prototype.loadUniforms = function (vertexUniforms, fragmentUniforms, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    Application.Debug.assert(isValidReference(gl));
                    Application.Debug.assert(isValidReference(vertexUniforms));
                    Application.Debug.assert(isValidReference(fragmentUniforms));
                    function loadUniformsInternal(uniforms, retVal, uniformDefaults, program, gl) {
                        if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                        Application.Debug.assert(isValidReference(gl));
                        Application.Debug.assert(isValidReference(retVal));
                        Application.Debug.assert(isValidReference(program));
                        Application.Debug.assert(isValidReference(uniforms));
                        Application.Debug.assert(isValidReference(uniformDefaults));
                        if (uniforms != null && retVal != null && program != null && gl != null) {
                            for (var i = 0; i < uniforms.length; i++) {
                                var uniform = uniforms[i];
                                var _uni = new renderPro.graphics.gl.Uniform(uniform.name, uniform.type, gl);
                                _uni.init(program);
                                if (_uni.location != -1 && _uni.location != null) {
                                    retVal[uniform.name] = _uni;
                                    if (uniform.defaultValue != undefined)
                                        _uni.set(uniform.defaultValue);
                                }
                            }
                        }
                    }
                    var uniformDefaults = {};
                    loadUniformsInternal(vertexUniforms, this.uniforms, uniformDefaults, this);
                    loadUniformsInternal(fragmentUniforms, this.uniforms, uniformDefaults, this);
                };
                Effect.prototype.loadAttributes = function (vertexAttributes, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    Application.Debug.assert(isValidReference(gl));
                    Application.Debug.assert(isValidReference(this.attributes));
                    Application.Debug.assert(isValidReference(vertexAttributes));
                    for (var i = 0; i < vertexAttributes.length; i++) {
                        var attr = vertexAttributes[i];
                        var attribute = new renderPro.graphics.gl.Attribute(attr.name, attr.type, gl);
                        attribute.updateLocation(this);
                        if (attribute.location != -1 && attribute.location != null) {
                            attribute.enable();
                            this.attributes[attribute.name] = attribute;
                        }
                    }
                };
                return Effect;
            }());
            gl_1.Effect = Effect;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

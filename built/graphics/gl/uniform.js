var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var Uniform = (function () {
                function Uniform(name, type, gl) {
                    if (gl === void 0) { gl = renderPro.graphics.gl.context; }
                    this.gl = gl;
                    this.name = name;
                    this.type = type;
                }
                Uniform.prototype.init = function (effect) {
                    if (effect === void 0) { effect = null; }
                    if (effect != null)
                        this.updateLocation(effect);
                    if (this.location == null) {
                        return null;
                    }
                    var self = this;
                    switch (this.type) {
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1f(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1fv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_2F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2f(self.location, args[0], args[1]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_2FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2fv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_3F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3f(self.location, args[0], args[1], args[2]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_3FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3fv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_4F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4f(self.location, args[0], args[1], args[2], args[3]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_4FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4fv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_MATRIX_2FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniformMatrix2fv(self.location, false, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_MATRIX_3FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniformMatrix3fv(self.location, false, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_MATRIX_4FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniformMatrix4fv(self.location, false, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1I:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1i(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_1IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1iv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_2I:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2i(self.location, args[0], args[1]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_2IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2iv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_3I:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3i(self.location, args[0], args[1], args[2]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_3IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3iv(self.location, args[0]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_4I:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4i(self.location, args[0], args[1], args[2], args[3]);
                            };
                            break;
                        case renderPro.graphics.gl.enums.ShaderValueType.UNIFORM_4IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4iv(self.location, args[0]);
                            };
                            break;
                    }
                };
                Uniform.prototype.updateLocation = function (effect) {
                    this.location = this.gl.getUniformLocation(effect.programPointer, this.name);
                };
                Uniform.prototype.updateValue = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var needUpdate = false;
                    // Check if new values are of a different length
                    if (this.values === undefined || this.values.length != args.length) {
                        needUpdate = true;
                    }
                    else {
                        // Check if every pair of values is different
                        for (var i = 0; i < args.length; i++) {
                            if (!this.compare(args[i], this.values[i])) {
                                needUpdate = true;
                                break;
                            }
                        }
                    }
                    if (needUpdate) {
                        this.values = args;
                        this.set.apply(self, args);
                    }
                };
                Uniform.prototype.compareSimpleValues = function (val1, val2) {
                    return val1 === val2;
                };
                Uniform.prototype.compareArrays = function (arr1, arr2) {
                    if (arr1.length != arr2.length) {
                        return false;
                    }
                    for (var i = 0; i < arr1.length; i++) {
                        if (arr1[i] != arr2[i]) {
                            return false;
                        }
                    }
                    return true;
                };
                return Uniform;
            }());
            gl_1.Uniform = Uniform;
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

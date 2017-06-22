var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl_1) {
            var UniformType;
            (function (UniformType) {
                UniformType[UniformType["UNIFORM_1F"] = 0] = "UNIFORM_1F";
                UniformType[UniformType["UNIFORM_1FV"] = 1] = "UNIFORM_1FV";
                UniformType[UniformType["UNIFORM_2F"] = 2] = "UNIFORM_2F";
                UniformType[UniformType["UNIFORM_2FV"] = 3] = "UNIFORM_2FV";
                UniformType[UniformType["UNIFORM_3F"] = 4] = "UNIFORM_3F";
                UniformType[UniformType["UNIFORM_3FV"] = 5] = "UNIFORM_3FV";
                UniformType[UniformType["UNIFORM_4F"] = 6] = "UNIFORM_4F";
                UniformType[UniformType["UNIFORM_4FV"] = 7] = "UNIFORM_4FV";
                UniformType[UniformType["UNIFORM_MATRIX_2FV"] = 8] = "UNIFORM_MATRIX_2FV";
                UniformType[UniformType["UNIFORM_MATRIX_3FV"] = 9] = "UNIFORM_MATRIX_3FV";
                UniformType[UniformType["UNIFORM_MATRIX_4FV"] = 10] = "UNIFORM_MATRIX_4FV";
                UniformType[UniformType["UNIFORM_1I"] = 11] = "UNIFORM_1I";
                UniformType[UniformType["UNIFORM_1IV"] = 12] = "UNIFORM_1IV";
                UniformType[UniformType["UNIFORM_2I"] = 13] = "UNIFORM_2I";
                UniformType[UniformType["UNIFORM_2IV"] = 14] = "UNIFORM_2IV";
                UniformType[UniformType["UNIFORM_3I"] = 15] = "UNIFORM_3I";
                UniformType[UniformType["UNIFORM_3IV"] = 16] = "UNIFORM_3IV";
                UniformType[UniformType["UNIFORM_4I"] = 17] = "UNIFORM_4I";
                UniformType[UniformType["UNIFORM_4IV"] = 18] = "UNIFORM_4IV";
            })(UniformType = gl_1.UniformType || (gl_1.UniformType = {}));
            var Uniform = (function () {
                function Uniform(gl, program, name, type) {
                    this.location = gl.getUniformLocation(program, name);
                    this.gl = gl;
                    this.name = name;
                    var self = this;
                    switch (type) {
                        case UniformType.UNIFORM_1F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1f(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_1FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1fv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_2F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2f(self.location, args[0], args[1]);
                            };
                            break;
                        case UniformType.UNIFORM_2FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2fv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_3F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3f(self.location, args[0], args[1], args[2]);
                            };
                            break;
                        case UniformType.UNIFORM_3FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3fv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_4F:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4f(self.location, args[0], args[1], args[2], args[3]);
                            };
                            break;
                        case UniformType.UNIFORM_4FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4fv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_MATRIX_2FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniformMatrix2fv(self.location, false, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_MATRIX_3FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniformMatrix3fv(self.location, false, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_MATRIX_4FV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniformMatrix4fv(self.location, false, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_1I:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1i(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_1IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform1iv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_2I:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2i(self.location, args[0], args[1]);
                            };
                            break;
                        case UniformType.UNIFORM_2IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform2iv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_3I:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3i(self.location, args[0], args[1], args[2]);
                            };
                            break;
                        case UniformType.UNIFORM_3IV:
                            this.compare = this.compareArrays;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform3iv(self.location, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_4I:
                            this.compare = this.compareSimpleValues;
                            this.set = function set() {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                self.gl.uniform4i(self.location, args[0], args[1], args[2], args[3]);
                            };
                            break;
                        case UniformType.UNIFORM_4IV:
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
                }
                Uniform.prototype.update = function () {
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

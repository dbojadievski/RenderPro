var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl) {
            var enums;
            (function (enums) {
                var ShaderValueType;
                (function (ShaderValueType) {
                    ShaderValueType[ShaderValueType["UNIFORM_1F"] = 0] = "UNIFORM_1F";
                    ShaderValueType[ShaderValueType["UNIFORM_1FV"] = 1] = "UNIFORM_1FV";
                    ShaderValueType[ShaderValueType["UNIFORM_2F"] = 2] = "UNIFORM_2F";
                    ShaderValueType[ShaderValueType["UNIFORM_2FV"] = 3] = "UNIFORM_2FV";
                    ShaderValueType[ShaderValueType["UNIFORM_3F"] = 4] = "UNIFORM_3F";
                    ShaderValueType[ShaderValueType["UNIFORM_3FV"] = 5] = "UNIFORM_3FV";
                    ShaderValueType[ShaderValueType["UNIFORM_4F"] = 6] = "UNIFORM_4F";
                    ShaderValueType[ShaderValueType["UNIFORM_4FV"] = 7] = "UNIFORM_4FV";
                    ShaderValueType[ShaderValueType["UNIFORM_MATRIX_2FV"] = 8] = "UNIFORM_MATRIX_2FV";
                    ShaderValueType[ShaderValueType["UNIFORM_MATRIX_3FV"] = 9] = "UNIFORM_MATRIX_3FV";
                    ShaderValueType[ShaderValueType["UNIFORM_MATRIX_4FV"] = 10] = "UNIFORM_MATRIX_4FV";
                    ShaderValueType[ShaderValueType["UNIFORM_1I"] = 11] = "UNIFORM_1I";
                    ShaderValueType[ShaderValueType["UNIFORM_1IV"] = 12] = "UNIFORM_1IV";
                    ShaderValueType[ShaderValueType["UNIFORM_2I"] = 13] = "UNIFORM_2I";
                    ShaderValueType[ShaderValueType["UNIFORM_2IV"] = 14] = "UNIFORM_2IV";
                    ShaderValueType[ShaderValueType["UNIFORM_3I"] = 15] = "UNIFORM_3I";
                    ShaderValueType[ShaderValueType["UNIFORM_3IV"] = 16] = "UNIFORM_3IV";
                    ShaderValueType[ShaderValueType["UNIFORM_4I"] = 17] = "UNIFORM_4I";
                    ShaderValueType[ShaderValueType["UNIFORM_4IV"] = 18] = "UNIFORM_4IV";
                })(ShaderValueType = enums.ShaderValueType || (enums.ShaderValueType = {}));
            })(enums = gl.enums || (gl.enums = {}));
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

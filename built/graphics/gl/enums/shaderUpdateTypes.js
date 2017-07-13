var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl) {
            var enums;
            (function (enums) {
                var ShaderUpdateTypes;
                (function (ShaderUpdateTypes) {
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_1F"] = 0] = "UNIFORM_1F";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_1FV"] = 1] = "UNIFORM_1FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_2F"] = 2] = "UNIFORM_2F";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_2FV"] = 3] = "UNIFORM_2FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_3F"] = 4] = "UNIFORM_3F";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_3FV"] = 5] = "UNIFORM_3FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_4F"] = 6] = "UNIFORM_4F";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_4FV"] = 7] = "UNIFORM_4FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_MATRIX_2FV"] = 8] = "UNIFORM_MATRIX_2FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_MATRIX_3FV"] = 9] = "UNIFORM_MATRIX_3FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_MATRIX_4FV"] = 10] = "UNIFORM_MATRIX_4FV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_1I"] = 11] = "UNIFORM_1I";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_1IV"] = 12] = "UNIFORM_1IV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_2I"] = 13] = "UNIFORM_2I";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_2IV"] = 14] = "UNIFORM_2IV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_3I"] = 15] = "UNIFORM_3I";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_3IV"] = 16] = "UNIFORM_3IV";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_4I"] = 17] = "UNIFORM_4I";
                    ShaderUpdateTypes[ShaderUpdateTypes["UNIFORM_4IV"] = 18] = "UNIFORM_4IV";
                })(ShaderUpdateTypes = enums.ShaderUpdateTypes || (enums.ShaderUpdateTypes = {}));
            })(enums = gl.enums || (gl.enums = {}));
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var gl;
        (function (gl) {
            var enums;
            (function (enums) {
                var ShaderUpdateType;
                (function (ShaderUpdateType) {
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_1F"] = 0] = "UNIFORM_1F";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_1FV"] = 1] = "UNIFORM_1FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_2F"] = 2] = "UNIFORM_2F";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_2FV"] = 3] = "UNIFORM_2FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_3F"] = 4] = "UNIFORM_3F";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_3FV"] = 5] = "UNIFORM_3FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_4F"] = 6] = "UNIFORM_4F";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_4FV"] = 7] = "UNIFORM_4FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_MATRIX_2FV"] = 8] = "UNIFORM_MATRIX_2FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_MATRIX_3FV"] = 9] = "UNIFORM_MATRIX_3FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_MATRIX_4FV"] = 10] = "UNIFORM_MATRIX_4FV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_1I"] = 11] = "UNIFORM_1I";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_1IV"] = 12] = "UNIFORM_1IV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_2I"] = 13] = "UNIFORM_2I";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_2IV"] = 14] = "UNIFORM_2IV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_3I"] = 15] = "UNIFORM_3I";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_3IV"] = 16] = "UNIFORM_3IV";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_4I"] = 17] = "UNIFORM_4I";
                    ShaderUpdateType[ShaderUpdateType["UNIFORM_4IV"] = 18] = "UNIFORM_4IV";
                })(ShaderUpdateType = enums.ShaderUpdateType || (enums.ShaderUpdateType = {}));
            })(enums = gl.enums || (gl.enums = {}));
        })(gl = graphics.gl || (graphics.gl = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

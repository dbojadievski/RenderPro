var renderPro;
(function (renderPro) {
    var math;
    (function (math) {
        var gl;
        (function (gl) {
            // Static methods for each alias
            var Vec3;
            (function (Vec3) {
                function create(v) { return vec3.create(v); }
                Vec3.create = create;
                ;
                function createFrom(x, y, z) { return vec3.createFrom(x, y, z); }
                Vec3.createFrom = createFrom;
                ;
                function set(v, dest) { return vec3.set(v, dest); }
                Vec3.set = set;
                ;
                function equal(a, b) { return vec3.equal(a, b); }
                Vec3.equal = equal;
                ;
                function add(v1, v2, dest) { return vec3.add(v1, v2, dest); }
                Vec3.add = add;
                ;
                function subtract(v1, v2, dest) { return vec3.subtract(v1, v2, dest); }
                Vec3.subtract = subtract;
                ;
                function multiply(v1, v2, dest) { return vec3.multiply(v1, v2, dest); }
                Vec3.multiply = multiply;
                ;
                function negate(v, dest) { return vec3.negate(v, dest); }
                Vec3.negate = negate;
                ;
                function scale(v, scale, dest) { return vec3.scale(v, scale, dest); }
                Vec3.scale = scale;
                ;
                function normalize(v, dest) { return vec3.normalize(v, dest); }
                Vec3.normalize = normalize;
                ;
                function cross(v1, v2, dest) { return vec3.cross(v1, v2, dest); }
                Vec3.cross = cross;
                ;
                function length(v) { return vec3.length(v); }
                Vec3.length = length;
                ;
                function squaredLength(v) { return vec3.squaredLength(v); }
                Vec3.squaredLength = squaredLength;
                ;
                function dot(v1, v2) { return vec3.dot(v1, v2); }
                Vec3.dot = dot;
                ;
                function direction(v1, v2, dest) { return vec3.direction(v1, v2, dest); }
                Vec3.direction = direction;
                ;
                function lerp(v1, v2, lerp, dest) { return vec3.lerp(v1, v2, lerp, dest); }
                Vec3.lerp = lerp;
                ;
                function dist(v1, v2) { return vec3.dist(v1, v2); }
                Vec3.dist = dist;
                ;
                function unproject(vec, view, proj, viewport, dest) { return vec3.unproject(vec, view, proj, viewport, dest); }
                Vec3.unproject = unproject;
                ;
                function rotationTo(a, b, dest) { return vec3.rotationTo(a, b, dest); }
                Vec3.rotationTo = rotationTo;
                function str(v) { return vec3.str(v); }
                Vec3.str = str;
                ;
                Vec3.fromValues = createFrom;
            })(Vec3 = gl.Vec3 || (gl.Vec3 = {}));
            var Mat3;
            (function (Mat3) {
                function create(m) { return mat3.create(m); }
                Mat3.create = create;
                function createFrom(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
                    return mat3.createFrom(m00, m01, m02, m10, m11, m12, m20, m21, m22);
                }
                Mat3.createFrom = createFrom;
                ;
                function determinant(m) { return mat3.determinant(m); }
                Mat3.determinant = determinant;
                ;
                function inverse(m, dest) { return mat3.inverse(m); }
                Mat3.inverse = inverse;
                ;
                function multiply(m1, m2, dest) { return mat3.multiply(m1, m2, dest); }
                Mat3.multiply = multiply;
                ;
                function multiplyByVec2(m, v, dest) { return mat3.multiplyByVec2(m, v, dest); }
                Mat3.multiplyByVec2 = multiplyByVec2;
                ;
                function multiplyByVec3(m, v, dest) { return mat3.multiplyByVec3(m, v, dest); }
                Mat3.multiplyByVec3 = multiplyByVec3;
                ;
                function set(m, dest) { return mat3.set(m, dest); }
                Mat3.set = set;
                ;
                function equal(m1, m2) { return mat3.equal(m1, m2); }
                Mat3.equal = equal;
                ;
                function identity(dest) { return mat3.identity(dest); }
                Mat3.identity = identity;
                ;
                function transpose(m, dest) { return mat3.transpose(m, dest); }
                Mat3.transpose = transpose;
                ;
                function toMat4(m, dest) { return mat3.toMat4(m, dest); }
                Mat3.toMat4 = toMat4;
                ;
                function str(m) { return mat3.str(m); }
                Mat3.str = str;
                ;
                function toQuat4(m, dest) { return quat4.toQuat4(m, dest); }
                Mat3.toQuat4 = toQuat4;
                ;
                Mat3.fromValues = createFrom;
            })(Mat3 = gl.Mat3 || (gl.Mat3 = {}));
            var Mat4;
            (function (Mat4) {
                function create(m) { return mat4.create(m); }
                Mat4.create = create;
                function createFrom(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
                    return mat4.createFrom(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
                }
                Mat4.createFrom = createFrom;
                ;
                function set(m, dest) { return mat4.set(m, dest); }
                Mat4.set = set;
                ;
                function equal(m1, m2) { return mat4.equal(m1, m2); }
                Mat4.equal = equal;
                ;
                function identity(dest) { return mat4.identity(dest); }
                Mat4.identity = identity;
                ;
                function transpose(m, dest) { return mat4.transpose(m, dest); }
                Mat4.transpose = transpose;
                ;
                function determinant(m) { return mat4.determinant(m); }
                Mat4.determinant = determinant;
                ;
                function inverse(m, dest) { return mat4.inverse(m); }
                Mat4.inverse = inverse;
                ;
                function toRotationMat(m, dest) { return mat4.toRotationMat(m, dest); }
                Mat4.toRotationMat = toRotationMat;
                ;
                function toMat3(m, dest) { return mat4.toMat3(m, dest); }
                Mat4.toMat3 = toMat3;
                ;
                function toInverseMat3(m, dest) { return mat4.toInverseMat3(m, dest); }
                Mat4.toInverseMat3 = toInverseMat3;
                ;
                function multiply(m1, m2, dest) { return mat4.multiply(m1, m2, dest); }
                Mat4.multiply = multiply;
                ;
                function multiplyByVec3(m, v, dest) { return mat4.multiplyByVec3(m, v, dest); }
                Mat4.multiplyByVec3 = multiplyByVec3;
                ;
                function multiplyByVec4(m, v, dest) { return mat4.multiplyByVec4(m, v, dest); }
                Mat4.multiplyByVec4 = multiplyByVec4;
                ;
                function translate(m, v, dest) { return mat4.translate(m, v, dest); }
                Mat4.translate = translate;
                ;
                function scale(m, v, dest) { return mat4.scale(m, v, dest); }
                Mat4.scale = scale;
                ;
                function rotate(m, angle, axis, dest) { return mat4.rotate(m, angle, axis, dest); }
                Mat4.rotate = rotate;
                function rotateX(m, angle, dest) { return mat4.rotateX(m, angle, dest); }
                Mat4.rotateX = rotateX;
                ;
                function rotateY(m, angle, dest) { return mat4.rotateY(m, angle, dest); }
                Mat4.rotateY = rotateY;
                ;
                function rotateZ(m, angle, dest) { return mat4.rotateZ(m, angle, dest); }
                Mat4.rotateZ = rotateZ;
                ;
                function frustrum(left, right, bottom, top, near, far, dest) { return mat4.frustrum(left, right, bottom, top, near, far, dest); }
                Mat4.frustrum = frustrum;
                ;
                function prespective(fovy, aspect, near, far, dest) { return mat4.prespective(fovy, aspect, near, far, dest); }
                Mat4.prespective = prespective;
                ;
                function ortho(left, right, bottom, top, near, far, dest) { return mat4.ortho(left, right, bottom, top, near, far, dest); }
                Mat4.ortho = ortho;
                ;
                function lookAt(eye, center, up, dest) { return mat4.lookAt(eye, center, up, dest); }
                Mat4.lookAt = lookAt;
                ;
                function fromRotationTranslation(quat, vec, dest) { return mat4.fromRotationTranslation(quat, vec, dest); }
                Mat4.fromRotationTranslation = fromRotationTranslation;
                ;
                function str(m) { return mat4.str(m); }
                Mat4.str = str;
                ;
                Mat4.fromValues = createFrom;
            })(Mat4 = gl.Mat4 || (gl.Mat4 = {}));
            var Quat4;
            (function (Quat4) {
                function create(quat) { return quat4.create(quat); }
                Quat4.create = create;
                ;
                function createFrom(x, y, z, w) { return quat4.createFrom(x, y, z, w); }
                Quat4.createFrom = createFrom;
                ;
                function set(quat, dest) { return quat4.set(quat, dest); }
                Quat4.set = set;
                ;
                function equal(a, b) { return quat4.equal(a, b); }
                Quat4.equal = equal;
                ;
                function identity(dest) { return quat4.identity(dest); }
                Quat4.identity = identity;
                ;
                function calulateW(quat, dest) { return quat4.calulateW(quat, dest); }
                Quat4.calulateW = calulateW;
                ;
                function inverse(quat, dest) { return quat4.inverse(quat, dest); }
                Quat4.inverse = inverse;
                ;
                function conjugate(quat, dest) { return quat4.conjugate(quat, dest); }
                Quat4.conjugate = conjugate;
                ;
                function length(quat) { return quat4.length(quat); }
                Quat4.length = length;
                ;
                function normalize(quat, dest) { return quat4.normalize(quat, dest); }
                Quat4.normalize = normalize;
                ;
                function add(q1, q2, dest) { return quat4.add(q1, q2, dest); }
                Quat4.add = add;
                ;
                function multiply(q1, q2, dest) { return quat4.multiply(q1, q2, dest); }
                Quat4.multiply = multiply;
                ;
                function multiplyVec3(quat, vec, dest) { return quat4.multiplyVec3(quat, vec, dest); }
                Quat4.multiplyVec3 = multiplyVec3;
                ;
                function scale(quat, scale, dest) { return quat4.scale(quat, scale, dest); }
                Quat4.scale = scale;
                ;
                function toMat3(quat, dest) { return quat4.toMat3(quat, dest); }
                Quat4.toMat3 = toMat3;
                ;
                function toMat4(quat, dest) { return quat4.toMat4(quat, dest); }
                Quat4.toMat4 = toMat4;
                ;
                function slerp(q1, q2, slerp, dest) { return quat4.slerp(q1, q2, slerp, dest); }
                Quat4.slerp = slerp;
                ;
                function fromRotationMatrix(m, dest) { return quat4.fromRotationMatrix(m, dest); }
                Quat4.fromRotationMatrix = fromRotationMatrix;
                ;
                function fromAxes(view, right, up, dest) { return quat4.fromAxes(view, right, up, dest); }
                Quat4.fromAxes = fromAxes;
                ;
                function fromAngleAxis(angle, axis, dest) { return quat4.fromAngleAxes(angle, axis, dest); }
                Quat4.fromAngleAxis = fromAngleAxis;
                ;
                function toAngleAxis(quat, dest) { return quat4.toAngleAxis(quat, dest); }
                Quat4.toAngleAxis = toAngleAxis;
                ;
                function str(quat) { return quat4.str(quat); }
                Quat4.str = str;
                ;
                Quat4.fromValues = createFrom;
            })(Quat4 = gl.Quat4 || (gl.Quat4 = {}));
            var Vec2;
            (function (Vec2) {
                function create(v) { return vec2.create(v); }
                Vec2.create = create;
                ;
                function createFrom(x, y) { return vec2.createFrom(x, y); }
                Vec2.createFrom = createFrom;
                ;
                function add(v1, v2, dest) { return vec2.add(v1, v2, dest); }
                Vec2.add = add;
                ;
                function subtract(v1, v2, dest) { return vec2.subtract(v1, v2, dest); }
                Vec2.subtract = subtract;
                ;
                function multiply(v1, v2, dest) { return vec2.multiply(v1, v2, dest); }
                Vec2.multiply = multiply;
                ;
                function divide(v1, v2, dest) { return vec2.divide(v1, v2, dest); }
                Vec2.divide = divide;
                ;
                function scale(v, scale, dest) { return vec2.scale(v, scale, dest); }
                Vec2.scale = scale;
                ;
                function dist(v1, v2) { return vec2.dist(v1, v2); }
                Vec2.dist = dist;
                ;
                function set(v, dest) { return vec2.set(v, dest); }
                Vec2.set = set;
                ;
                function equal(a, b) { return vec2.equal(a, b); }
                Vec2.equal = equal;
                ;
                function negate(v, dest) { return vec2.negate(v, dest); }
                Vec2.negate = negate;
                ;
                function normalize(v, dest) { return vec2.normalize(v, dest); }
                Vec2.normalize = normalize;
                ;
                function cross(v1, v2, dest) { return vec2.cross(v1, v2, dest); }
                Vec2.cross = cross;
                ;
                function length(v) { return vec2.length(v); }
                Vec2.length = length;
                ;
                function squaredLength(v) { return vec2.squaredLength(v); }
                Vec2.squaredLength = squaredLength;
                ;
                function dot(v1, v2) { return vec2.dot(v1, v2); }
                Vec2.dot = dot;
                ;
                function direction(v1, v2, dest) { return vec2.direction(v1, v2, dest); }
                Vec2.direction = direction;
                ;
                function lerp(v1, v2, lerp, dest) { return vec2.lerp(v1, v2, lerp, dest); }
                Vec2.lerp = lerp;
                ;
                function str(v) { return vec2.str(v); }
                Vec2.str = str;
                ;
                Vec2.fromValues = createFrom;
            })(Vec2 = gl.Vec2 || (gl.Vec2 = {}));
            var Mat2;
            (function (Mat2) {
                function create(m) { return mat2.create(m); }
                Mat2.create = create;
                ;
                function createFrom(m00, m01, m10, m11) {
                    return mat2.createFrom(m00, m01, m10, m11);
                }
                Mat2.createFrom = createFrom;
                ;
                function set(m, dest) { return mat2.set(m, dest); }
                Mat2.set = set;
                ;
                function equal(m1, m2) { return mat2.equal(m1, m2); }
                Mat2.equal = equal;
                ;
                function identity(dest) { return mat2.identity(dest); }
                Mat2.identity = identity;
                ;
                function transpose(m, dest) { return mat2.transpose(m, dest); }
                Mat2.transpose = transpose;
                ;
                function determinant(m) { return mat2.determinant(m); }
                Mat2.determinant = determinant;
                ;
                function inverse(m, dest) { return mat2.inverse(m); }
                Mat2.inverse = inverse;
                ;
                function multiply(m1, m2, dest) { return mat2.multiply(m1, m2, dest); }
                Mat2.multiply = multiply;
                ;
                function rotate(mat, angle, dest) { return mat2.rotate(mat, angle, dest); }
                Mat2.rotate = rotate;
                ;
                function multiplyVec2(m, v, dest) { return mat2.multiplyVec2(m, v, dest); }
                Mat2.multiplyVec2 = multiplyVec2;
                ;
                function scale(m, v, dest) { return mat2.scale(m, v, dest); }
                Mat2.scale = scale;
                ;
                function str(m) { return mat2.str(m); }
                Mat2.str = str;
                ;
            })(Mat2 = gl.Mat2 || (gl.Mat2 = {}));
            var Vec4;
            (function (Vec4) {
                function create(quat) { return vec4.create(quat); }
                Vec4.create = create;
                ;
                function createFrom(x, y, z, w) { return vec4.createFrom(x, y, z, w); }
                Vec4.createFrom = createFrom;
                ;
                function add(v1, v2, dest) { return vec4.add(v1, v2, dest); }
                Vec4.add = add;
                ;
                function subtract(v1, v2, dest) { return vec4.subtract(v1, v2, dest); }
                Vec4.subtract = subtract;
                ;
                function multiply(v1, v2, dest) { return vec4.multiply(v1, v2, dest); }
                Vec4.multiply = multiply;
                ;
                function divide(v1, v2, dest) { return vec4.divide(v1, v2, dest); }
                Vec4.divide = divide;
                ;
                function scale(v, scale, dest) { return vec4.scale(v, scale, dest); }
                Vec4.scale = scale;
                ;
                function set(v, dest) { return vec4.set(v, dest); }
                Vec4.set = set;
                ;
                function equal(a, b) { return vec4.equal(a, b); }
                Vec4.equal = equal;
                ;
                function negate(v, dest) { return vec4.negate(v, dest); }
                Vec4.negate = negate;
                ;
                function length(v) { return vec4.length(v); }
                Vec4.length = length;
                ;
                function squaredLength(v) { return vec4.squaredLength(v); }
                Vec4.squaredLength = squaredLength;
                ;
                function lerp(v1, v2, lerp, dest) { return vec4.lerp(v1, v2, lerp, dest); }
                Vec4.lerp = lerp;
                ;
                function str(quat) { return vec4.str(quat); }
                Vec4.str = str;
                ;
            })(Vec4 = gl.Vec4 || (gl.Vec4 = {}));
        })(gl = math.gl || (math.gl = {}));
    })(math = renderPro.math || (renderPro.math = {}));
})(renderPro || (renderPro = {}));

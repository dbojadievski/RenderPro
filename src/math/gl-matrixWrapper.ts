namespace renderPro {
    export namespace math {
        export namespace gl {
            //Aliases for types
            export type Vec2 = Array<number>;
            export type Vec3 = Array<number>;
            export type Mat2 = Array<number>;
            export type Mat3 = Array<number>;
            export type Vec4 = Array<number>;
            export type Quat4 = Vec4;
            export type Mat4 = Array<number>;

            // Static methods for each alias
            export namespace Vec3 {
                export function create ( v? : Vec3) : Vec3 { return vec3.create(v); };
                export function createFrom ( x : number, y : number, z : number) : Vec3 { return vec3.createFrom(x, y, z); };
                export function set ( v : Vec3, dest : Vec3 ) : Vec3 { return vec3.set(v, dest); };
                export function equal ( a : Vec3, b : Vec3 ) : boolean { return vec3.equal(a, b); };
                export function add ( v1 : Vec3, v2 : Vec3, dest? : Vec3 ) : Vec3 { return vec3.add(v1, v2, dest); };
                export function subtract ( v1 : Vec3, v2: Vec3, dest? : Vec3) : Vec3 { return vec3.subtract(v1, v2, dest); };
                export function multiply ( v1 : Vec3, v2 : Vec3, dest? : Vec3 ) : Vec3 { return vec3.multiply(v1, v2, dest); };
                export function negate ( v : Vec3, dest? : Vec3 ) : Vec3 { return vec3.negate(v, dest); };
                export function scale ( v : Vec3, scale : number, dest? : Vec3 ) : Vec3 { return vec3.scale(v, scale, dest); };
                export function normalize ( v : Vec3, dest? : Vec3 ) : Vec3 { return vec3.normalize(v, dest); };
                export function cross ( v1 : Vec3, v2 : Vec3, dest? : Vec3 ) : Vec3 { return vec3.cross(v1, v2, dest); };
                export function length ( v : Vec3 ) : number { return vec3.length(v); };
                export function squaredLength ( v : Vec3 ) : number { return vec3.squaredLength(v); };
                export function dot ( v1 : Vec3, v2 : Vec3 ) : number { return vec3.dot(v1, v2); };
                export function direction ( v1 : Vec3, v2 : Vec3, dest? : Vec3 ) : Vec3 { return vec3.direction(v1, v2, dest); };
                export function lerp ( v1 : Vec3, v2 : Vec3, lerp : number, dest? : Vec3 ) : Vec3 { return vec3.lerp(v1, v2, lerp, dest); };
                export function dist ( v1 : Vec3, v2 : Vec3 ) : number { return vec3.dist(v1, v2); };
                export function unproject ( vec : Vec3, view : Mat4, proj : Mat4, viewport : Vec4, dest? : Vec3) : Vec3 { return vec3.unproject(vec, view, proj, viewport, dest); };
                export function rotationTo ( a : Vec3, b : Vec3, dest? : Quat4 ) : Quat4 { return vec3.rotationTo(a, b, dest)}
                export function str ( v : Vec3 ) : string { return vec3.str(v); };
                export const fromValues = createFrom;
            }
            export namespace Mat3 {
                export function create ( m? : Mat3 ) : Mat3 { return mat3.create(m) }
                export function createFrom ( 
                    m00 : number, m01 : number, m02 : number, 
                    m10 : number, m11 : number, m12 : number, 
                    m20 : number, m21 : number, m22 : number) : Mat3 { 
                        return mat3.createFrom(m00, m01, m02, m10, m11, m12, m20, m21, m22); 
                    };
                export function determinant ( m : Mat3 ) : number { return mat3.determinant(m); };
                export function inverse ( m : Mat3, dest? : Mat3 ) : Mat3 { return mat3.inverse(m); };
                export function multiply ( m1 : Mat3, m2 : Mat3, dest? : Mat3 ) : Mat3 { return mat3.multiply(m1, m2, dest); };
                export function multiplyByVec2 ( m : Mat3, v : Vec2, dest? : Vec2 ) : Vec2 { return mat3.multiplyByVec2(m, v, dest); };
                export function multiplyByVec3 ( m : Mat3, v : Vec3, dest? : Vec3 ) : Vec3 { return mat3.multiplyByVec3(m, v, dest); };
                export function set ( m : Mat3, dest : Mat3 ) : Mat3 { return mat3.set(m, dest); };
                export function equal ( m1 : Mat3, m2 : Mat3 ) : boolean { return mat3.equal(m1, m2); };
                export function identity ( dest : Mat3 ) : Mat3 { return mat3.identity(dest); };
                export function transpose ( m : Mat3, dest? : Mat3 ) : Mat3 { return mat3.transpose(m, dest); };
                export function toMat4 ( m : Mat3, dest? : Mat4 ) : Mat4 { return mat3.toMat4(m, dest); };
                export function str ( m : Mat3 ) : string { return mat3.str(m); };
                export function toQuat4 ( m : Mat3, dest: Quat4 ) : Quat4 { return quat4.toQuat4(m, dest); };
                export const fromValues = createFrom;
            }
            export namespace Mat4 {
                export function create ( m? : Mat4 ) : Mat4 { return mat4.create(m) }
                export function createFrom ( 
                    m00 : number, m01 : number, m02 : number, m03 : number,
                    m10 : number, m11 : number, m12 : number, m13 : number,
                    m20 : number, m21 : number, m22 : number, m23 : number,
                    m30 : number, m31 : number, m32 : number, m33 : number) : Mat4 { 
                        return mat4.createFrom(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33); 
                    };
                export function set ( m : Mat4, dest : Mat4 ) : Mat4 { return mat4.set(m, dest); };
                export function equal ( m1 : Mat4, m2 : Mat4 ) : boolean { return mat4.equal(m1, m2); };
                export function identity ( dest : Mat4 ) : Mat4 { return mat4.identity(dest); };
                export function transpose ( m : Mat4, dest? : Mat4 ) : Mat4 { return mat4.transpose(m, dest); };
                export function determinant ( m : Mat4 ) : number { return mat4.determinant(m); };
                export function inverse ( m : Mat4, dest? : Mat4 ) : Mat4 { return mat4.inverse(m); };
                export function toRotationMat ( m : Mat4, dest? : Mat4 ) : Mat4 { return mat4.toRotationMat(m, dest); };
                export function toMat3 ( m : Mat4, dest? : Mat3 ) : Mat3 { return mat4.toMat3(m, dest); };
                export function toInverseMat3 ( m : Mat4, dest? : Mat3 ) : Mat3 { return mat4.toInverseMat3(m, dest); };
                export function multiply ( m1 : Mat4, m2 : Mat4, dest? : Mat4 ) : Mat4 { return mat4.multiply(m1, m2, dest); };
                export function multiplyByVec3 ( m : Mat4, v : Vec3, dest? : Vec3 ) : Vec3 { return mat4.multiplyByVec3(m, v, dest); };
                export function multiplyByVec4 ( m : Mat4, v : Vec4, dest? : Vec4 ) : Vec4 { return mat4.multiplyByVec4(m, v, dest); };
                export function translate ( m : Mat4, v : Vec4, dest? : Mat4 ) : Mat4 { return mat4.translate(m, v, dest); };
                export function scale ( m : Mat4, v : Vec4, dest? : Mat4 ) : Mat4 { return mat4.scale(m, v, dest); };
                export function rotate ( m : Mat4, angle : number, axis : Vec3, dest? : Mat4 ) : Mat4 { return mat4.rotate(m, angle, axis, dest)}
                export function rotateX ( m : Mat4, angle : number, dest? : Mat4 ) : Mat4 { return mat4.rotateX(m, angle, dest); };
                export function rotateY ( m : Mat4, angle : number, dest? : Mat4 ) : Mat4 { return mat4.rotateY(m, angle, dest); };
                export function rotateZ ( m : Mat4, angle : number, dest? : Mat4 ) : Mat4 { return mat4.rotateZ(m, angle, dest); };
                export function frustrum ( left : number, right : number, bottom : number, top : number, near : number, far : number, dest? : Mat4) : Mat4 { return mat4.frustrum(left, right, bottom, top, near, far, dest); };
                export function prespective ( fovy : number, aspect : number, near : number, far : number, dest? : Mat4) : Mat4 { return mat4.prespective(fovy, aspect, near, far, dest); };
                export function ortho ( left : number, right : number, bottom : number, top : number, near : number, far : number, dest? : Mat4) : Mat4 { return mat4.ortho(left, right, bottom, top, near, far, dest); };
                export function lookAt (eye : Vec3, center : Vec3, up : Vec3, dest? : Mat4 ) : Mat4 { return mat4.lookAt(eye, center, up, dest); };
                export function fromRotationTranslation( quat : Quat4, vec : Vec3, dest? : Mat4) : Mat4 { return mat4.fromRotationTranslation(quat, vec, dest); };
                export function str ( m : Mat4 ) : string { return mat4.str(m); };
                export const fromValues = createFrom;
            }
            export namespace Quat4 {
                export function create ( quat? : Quat4 ) : Quat4 { return quat4.create(quat); };
                export function createFrom ( x : number, y : number, z : number, w : number) : Quat4 { return quat4.createFrom(x, y, z, w); };
                export function set ( quat : Quat4, dest : Quat4 ) : Quat4 { return quat4.set(quat, dest); };
                export function equal ( a : Quat4, b : Quat4 ) : boolean { return quat4.equal(a, b); };
                export function identity ( dest? : Quat4 ) : Quat4 { return quat4.identity(dest); };
                export function calulateW ( quat : Quat4, dest? : Quat4 ) : Quat4 { return quat4.calulateW(quat, dest); };
                export function inverse ( quat : Quat4, dest? : Quat4 ) : Quat4 { return quat4.inverse(quat, dest); };
                export function conjugate ( quat : Quat4, dest? : Quat4 ) : Quat4 { return quat4.conjugate(quat, dest); };
                export function length ( quat : Quat4 ) : number { return quat4.length(quat); };
                export function normalize ( quat : Quat4, dest? : Quat4 ) : Quat4 { return quat4.normalize(quat, dest); };
                export function add ( q1 : Quat4, q2 : Quat4, dest? : Quat4 ) : Quat4 { return quat4.add(q1, q2, dest); };
                export function multiply ( q1 : Quat4, q2 : Quat4, dest? : Quat4 ) : Quat4 { return quat4.multiply(q1, q2, dest); };
                export function multiplyVec3 ( quat : Quat4, vec : Vec3, dest? : Vec3 ) : Vec3 { return quat4.multiplyVec3(quat, vec, dest); };
                export function scale ( quat : Quat4, scale : number, dest? : Quat4 ) : Quat4 { return quat4.scale(quat, scale, dest); };
                export function toMat3 ( quat: Quat4, dest: Mat3 ) : Mat3 { return quat4.toMat3(quat, dest); };
                export function toMat4 ( quat: Quat4, dest: Mat4 ) : Mat4 { return quat4.toMat4(quat, dest); };
                export function slerp ( q1 : Quat4, q2 : Quat4, slerp : number, dest? : Quat4 ) : Quat4 { return quat4.slerp(q1, q2, slerp, dest); };
                export function fromRotationMatrix ( m : Mat3, dest: Quat4 ) : Quat4 { return quat4.fromRotationMatrix(m, dest); }; 
                export function fromAxes (view : Vec3, right : Vec3, up : Vec3, dest? : Quat4) { return quat4.fromAxes(view, right, up, dest); };
                export function fromAngleAxis (angle : number, axis : Vec3, dest? : Quat4) { return quat4.fromAngleAxes(angle,axis,dest); };
                export function toAngleAxis ( quat: Quat4, dest: Vec4) { return quat4.toAngleAxis(quat, dest); };
                export function str ( quat : Quat4 ) : string { return quat4.str(quat); };
                export const fromValues = createFrom;
            }
            export namespace Vec2 {
                export function create ( v? : Vec2) : Vec2 { return vec2.create(v); };
                export function createFrom ( x : number, y : number) : Vec2 { return vec2.createFrom(x, y); };
                export function add ( v1 : Vec2, v2 : Vec2, dest? : Vec2 ) : Vec2 { return vec2.add(v1, v2, dest); };
                export function subtract ( v1 : Vec2, v2: Vec2, dest? : Vec2) : Vec2 { return vec2.subtract(v1, v2, dest); };
                export function multiply ( v1 : Vec2, v2 : Vec2, dest? : Vec2 ) : Vec2 { return vec2.multiply(v1, v2, dest); };
                export function divide ( v1 : Vec2, v2 : Vec2, dest? : Vec2 ) : Vec2 { return vec2.divide(v1, v2, dest); };
                export function scale ( v : Vec2, scale : number, dest? : Vec2 ) : Vec2 { return vec2.scale(v, scale, dest); };
                export function dist ( v1 : Vec2, v2 : Vec2 ) : number { return vec2.dist(v1, v2); };
                export function set ( v : Vec2, dest : Vec2 ) : Vec2 { return vec2.set(v, dest); };
                export function equal ( a : Vec2, b : Vec2 ) : boolean { return vec2.equal(a, b); };
                export function negate ( v : Vec2, dest? : Vec2 ) : Vec2 { return vec2.negate(v, dest); };
                export function normalize ( v : Vec2, dest? : Vec2 ) : Vec2 { return vec2.normalize(v, dest); };
                export function cross ( v1 : Vec2, v2 : Vec2, dest? : Vec2 ) : Vec2 { return vec2.cross(v1, v2, dest); };
                export function length ( v : Vec2 ) : number { return vec2.length(v); };
                export function squaredLength ( v : Vec2 ) : number { return vec2.squaredLength(v); };
                export function dot ( v1 : Vec2, v2 : Vec2 ) : number { return vec2.dot(v1, v2); };
                export function direction ( v1 : Vec2, v2 : Vec2, dest? : Vec2 ) : Vec2 { return vec2.direction(v1, v2, dest); };
                export function lerp ( v1 : Vec2, v2 : Vec2, lerp : number, dest? : Vec2 ) : Vec2 { return vec2.lerp(v1, v2, lerp, dest); };
                export function str ( v : Vec2 ) : string { return vec2.str(v); };
                export const fromValues = createFrom;
            }
            export namespace Mat2 {
                export function create ( m? : Mat2 ) : Mat2 { return mat2.create(m); };
                export function createFrom ( 
                    m00 : number, m01 : number,
                    m10 : number, m11 : number) : Mat2 { 
                        return mat2.createFrom(m00, m01, m10, m11); 
                    };
                export function set ( m : Mat2, dest : Mat2 ) : Mat2 { return mat2.set(m, dest); };
                export function equal ( m1 : Mat2, m2 : Mat2 ) : boolean { return mat2.equal(m1, m2); };
                export function identity ( dest: Mat2 ) : Mat2 { return mat2.identity(dest); };
                export function transpose ( m : Mat2, dest? : Mat2 ) : Mat2 { return mat2.transpose(m, dest); };
                export function determinant ( m : Mat2 ) : number { return mat2.determinant(m); };
                export function inverse ( m : Mat2, dest? : Mat2 ) : Mat2 { return mat2.inverse(m); };
                export function multiply ( m1 : Mat2, m2 : Mat2, dest? : Mat2 ) : Mat2 { return mat2.multiply(m1, m2, dest); };
                export function rotate ( mat : Mat2, angle: number, dest: Mat2) : Mat2 { return mat2.rotate(mat, angle, dest); };
                export function multiplyVec2 ( m : Mat2, v : Vec2, dest? : Vec2 ) : Vec2 { return mat2.multiplyVec2(m, v, dest); };
                export function scale ( m : Mat2, v: Vec2, dest: Vec2) { return mat2.scale(m, v, dest); };
                export function str ( m : Mat2 ) : string { return mat2.str(m); };
            }
            export namespace Vec4 {
                export function create ( quat? : Vec4 ) : Vec4 { return vec4.create(quat); };
                export function createFrom ( x : number, y : number, z : number, w : number) : Vec4 { return vec4.createFrom(x, y, z, w); };
                export function add ( v1 : Vec4, v2 : Vec4, dest? : Vec4 ) : Vec4 { return vec4.add(v1, v2, dest); };
                export function subtract ( v1 : Vec4, v2 : Vec4, dest? : Vec4 ) : Vec4 { return vec4.subtract(v1, v2, dest); };
                export function multiply ( v1 : Vec4, v2 : Vec4, dest? : Vec4 ) : Vec4 { return vec4.multiply(v1, v2, dest); };
                export function divide ( v1 : Vec4, v2 : Vec4, dest? : Vec4 ) : Vec4 { return vec4.divide(v1, v2, dest); };
                export function scale ( v : Vec4, scale : number, dest? : Vec4 ) : Vec4 { return vec4.scale(v, scale, dest); };
                export function set ( v : Vec4, dest : Vec4 ) : Vec4 { return vec4.set(v, dest); };
                export function equal ( a : Vec4, b : Vec4 ) : boolean { return vec4.equal(a, b); };
                export function negate ( v : Vec4, dest? : Vec4 ) : Vec4 { return vec4.negate(v, dest); };
                export function length ( v : Vec4 ) : number { return vec4.length(v); };
                export function squaredLength ( v : Vec4 ) : number { return vec4.squaredLength(v); };
                export function lerp ( v1 : Vec4, v2 : Vec4, lerp : number, dest? : Vec4 ) : Vec4 { return vec4.lerp(v1, v2, lerp, dest); };
                export function str ( quat : Vec4 ) : string { return vec4.str(quat); };
            }
            
        }
       
    }
}
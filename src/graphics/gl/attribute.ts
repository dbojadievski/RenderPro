namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Attribute {
                name: string
                type: renderPro.graphics.gl.enums.ShaderValueType
                location: GLint
                gl: WebGLRenderingContext
                constructor (name : string, type : renderPro.graphics.gl.enums.ShaderValueType, gl: WebGLRenderingContext = renderPro.graphics.gl.context) {
                    this.name = name
                    this.type = type
                    this.gl = gl
                }
                updateLocation ( effect : renderPro.graphics.gl.Effect) {
                    this.location = this.gl.getAttribLocation(effect.programPointer, this.name);
                }
                enable () {
                    this.gl.enableVertexAttribArray(this.location);
                }
                disable () {
                    this.gl.disableVertexAttribArray(this.location);
                }

            }
        }
    }
}
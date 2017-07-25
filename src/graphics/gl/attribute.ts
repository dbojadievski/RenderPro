namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Attribute {
                name: string
                type: renderPro.graphics.gl.enums.ShaderUpdateType
                location: GLint
                gl: WebGLRenderingContext
                constructor (name : string, type : renderPro.graphics.gl.enums.ShaderUpdateType, gl: WebGLRenderingContext = renderPro.graphics.gl.context) {
                    this.name = name
                    this.type = type
                    this.gl = gl
                }
                updateLocation ( effect : renderPro.graphics.gl.Effect) {
                    Application.Debug.assert ( isValidReference ( effect ) );
                    this.location = this.gl.getAttribLocation ( effect.programPointer, this.name );
                }

                enable () {
                    this.gl.enableVertexAttribArray ( this.location );
                }

                disable () 
                {
                    this.gl.disableVertexAttribArray ( this.location );
                }

            }
        }
    }
}
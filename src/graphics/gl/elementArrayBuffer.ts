namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class ElementArrayBuffer {
                pointer:  WebGLBuffer
                gl: WebGLRenderingContext
                constructor ( gl : WebGLRenderingContext )
                {
                    this.pointer                        =  gl.createBuffer ( );
                    this.gl = gl
                }
                bufferData ( indices : Array<number> ) : void
                {
                    let gl : WebGLRenderingContext                        = this.gl;
                    gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, this.pointer );
                    gl.bufferData ( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array ( indices ), gl.STATIC_DRAW );
                    gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, null );
                }
                free ( ) : void
                {
                    this.gl.deleteBuffer ( this.pointer );
                }
            }            
        }
    }
}
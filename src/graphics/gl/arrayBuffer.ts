namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class ArrayBuffer {
                pointer:  WebGLBuffer 
                gl: WebGLRenderingContext
                constructor ( gl : WebGLRenderingContext )
                {
                    Application.Debug.assert ( isValidReference ( gl ) );

                    this.pointer                    = gl.createBuffer ( );
                    this.gl                         = gl;
                }

                bufferData ( vertices : any ) : void
                {
                    Application.Debug.assert ( isValidReference ( vertices ) );

                    let gl : WebGLRenderingContext  = this.gl;
                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.pointer );
                    gl.bufferData ( gl.ARRAY_BUFFER, new Float32Array ( vertices ), gl.STATIC_DRAW );
                    gl.bindBuffer ( gl.ARRAY_BUFFER, null );
                }
                
                free ( ) : void
                {
                    this.gl.deleteBuffer ( this.pointer );
                }
            }
        }
    }
}
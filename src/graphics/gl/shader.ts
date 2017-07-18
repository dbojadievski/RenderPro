namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Shader {
                pointer: WebGLShader
                constructor () 
                {
                    this.pointer = null;
                }
                load (shaderSrc : string, shaderType: GLenum, gl : WebGLRenderingContext = renderPro.graphics.gl.context )
                {
                    /* Create the shader */
                    this.pointer =  gl.createShader(shaderType);

                    /* Set the source of the shader */
                    gl.shaderSource ( this.pointer, shaderSrc );

                    /* Compile the shader */
                    gl.compileShader ( this.pointer );
                    if ( !gl.getShaderParameter ( this.pointer, gl.COMPILE_STATUS ) )
                    {
                        alert( gl.getShaderInfoLog ( this.pointer ) );
                        return null;
                    }
                }
            }
        }
    }
}
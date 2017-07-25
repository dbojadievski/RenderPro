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
                    Application.Debug.assert ( isValidReference ( gl ) );
                    Application.Debug.assert ( isValidReference ( shaderSrc ) );
                    Application.Debug.assert ( isValidReference ( shaderType ) );
                    
                    let isCreated       = false;
                    this.pointer        =  gl.createShader(shaderType);
                    Application.Debug.assert ( this.pointer != -1 );
                    if ( this.pointer != -1 && this.pointer != null )
                    {
                        gl.shaderSource ( this.pointer, shaderSrc );

                        gl.compileShader ( this.pointer );
                        if ( !gl.getShaderParameter ( this.pointer, gl.COMPILE_STATUS ) )
                            alert( gl.getShaderInfoLog ( this.pointer ) );
                        else
                            isCreated   = true;
                    }

                    return isCreated;
                }
            }
        }
    }
}
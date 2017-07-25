namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Texture {
                texture :  WebGLTexture
                textureID : number
                static _currentTextureID : number
                gl : WebGLRenderingContext
                constructor ( gl : WebGLRenderingContext = renderPro.graphics.gl.context) 
                {
                    Application.Debug.assert ( isValidReference ( gl ) );
                    this.gl                                     = gl
                    this.texture                                = gl.createTexture ( );
                    if ( Texture._currentTextureID == undefined )
                        Texture._currentTextureID               = 1;
                    this.textureID                              = Texture._currentTextureID++;
                }
                load ( image  )
                {
                    Application.Debug.assert ( isValidReference ( image ) );

                    let gl                                      =  this.gl;
                    gl.bindTexture ( gl.TEXTURE_2D, this.texture );
                    gl.texImage2D ( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
                    gl.pixelStorei ( gl.UNPACK_FLIP_Y_WEBGL, true );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
                    gl.bindTexture ( gl.TEXTURE_2D, null );
                }

                loadFloatTexture ( data: ArrayBufferView, width: number, height: number )
                {
                    Application.Debug.assert ( isValidReference ( data ) );
                    Application.Debug.assert ( width > 0 && height > 0 );

                    let gl                                      =  this.gl;
                    gl.bindTexture ( gl.TEXTURE_2D, this.texture );
                    gl.texImage2D ( gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, data );
                    gl.pixelStorei ( gl.UNPACK_FLIP_Y_WEBGL, true );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
                    gl.bindTexture ( gl.TEXTURE_2D, null );
                }
                
                loadByteTexture ( data: ArrayBufferView, width: number, height: number )
                {
                    Application.Debug.assert ( isValidReference ( data ) );
                    Application.Debug.assert ( width > 0 && height > 0 );

                    let gl                                      = this.gl;
                    gl.bindTexture ( gl.TEXTURE_2D, this.texture );
                    gl.texImage2D ( gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data );
                    gl.pixelStorei ( gl.UNPACK_FLIP_Y_WEBGL, true );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
                    gl.bindTexture ( gl.TEXTURE_2D, null );
                }

                unload ( )
                {
                    let gl                                      =  renderPro.graphics.gl.context;
                    gl.deleteTexture ( this.texture );
                }
            }
        }
    }
}
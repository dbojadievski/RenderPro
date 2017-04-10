namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Texture {
                texture : any
                textureID : number
                static _currentTextureID : number
                constructor ( ) 
                {
                    var gl : any                             = renderPro.graphics.gl.context;
                    this.texture                                = gl.createTexture ( );

                    if ( Texture._currentTextureID == undefined )
                        Texture._currentTextureID               = 1;
                    this.textureID                              = Texture._currentTextureID++;
                }
                load ( image  )
                {
                    var gl                                      =  renderPro.graphics.gl.context;
                    gl.bindTexture ( gl.TEXTURE_2D, this.texture );
                    gl.texImage2D ( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
                    gl.pixelStorei ( gl.UNPACK_FLIP_Y_WEBGL, true );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
                    gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
                    gl.bindTexture ( gl.TEXTURE_2D, null );
                }
                unload ( )
                {
                    var gl                                      =  renderPro.graphics.gl.context;
                    gl.deleteTexture ( this.texture );
                }
            }
        }
    }
}
( function ( ) 
{
    function Texture ( gl ) 
    {
        this.texture                                = gl.createTexture ( );

        if ( Texture._currentTextureID == undefined )
            Texture._currentTextureID               = 1;
        this.textureID                              = Texture._currentTextureID++;
    }

    Texture.prototype.load                          = function texture_load ( image, gl )
    {
        gl.bindTexture ( gl.TEXTURE_2D, this.texture );
        gl.texImage2D ( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
        gl.pixelStorei ( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri ( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.bindTexture ( gl.TEXTURE_2D, null );
    };

    Texture.prototype.unload                        = function texture_unload ( gl )
    {
        gl.deleteTexture ( this.texture );
    };

    renderPro.graphics.gl.Texture                   = Texture;
} ) ( );
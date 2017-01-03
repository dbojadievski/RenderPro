( function ( ) 
{
    function Texture ( src )
    {
        var self                        = this;

        this.image                      = new Image ( );
        this.image.crossOrigin          = "";
        this.innerTexture               = new renderPro.graphics.gl.Texture ( renderPro.graphics.gl.context );
        this.image.onload               = function texture_loaded ( ) 
        { 
            self.innerTexture.load ( self.image, renderPro.graphics.gl.context );
        };
        this.image.src                  = src;

        if ( Texture._currentTextureID == undefined )
            Texture._currentTextureID   = 1;
        this.textureID                  = Texture._currentTextureID;
        // document.body.appendChild ( this.image ); /* Uncomment to view texture for debugging. */ 
    }

    Texture.prototype.unload            = function texture_unload ( )
    {
        self.innerTexture.unload ( renderPro.graphics.gl.context );
    };

    renderPro.graphics.core.Texture     = Texture;
} ) ( );
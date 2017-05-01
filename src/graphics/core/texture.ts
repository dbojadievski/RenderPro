namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Texture {
                image: HTMLImageElement
                textureID: number
                innerTexture: renderPro.graphics.gl.Texture
                static _currentTextureID : number
                constructor ( src : string )
                {
                    let self : renderPro.graphics.core.Texture   = this;

                    this.image                      = new Image ( );
                    this.image.crossOrigin          = "";
                    this.innerTexture               = new renderPro.graphics.gl.Texture ( );
                    this.image.onload               = function texture_loaded ( ) 
                    {
                        self.innerTexture.load ( self.image );
                    };
                    this.image.src                  = src;

                    if ( Texture._currentTextureID == undefined )
                        Texture._currentTextureID   = 1;
                    this.textureID                  = Texture._currentTextureID;
                    // document.body.appendChild ( this.image ); /* Uncomment to view texture for debugging. */ 
                }
                unload ( ) : void
                {
                    this.innerTexture.unload (  );
                };
            }
        }
    }
}
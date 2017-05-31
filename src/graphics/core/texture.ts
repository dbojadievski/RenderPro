namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Texture {
                image: HTMLImageElement
                textureID: number
                innerTexture: renderPro.graphics.gl.Texture
                static _currentTextureID : number
                constructor ( src: string = null )
                {
                    let self : renderPro.graphics.core.Texture   = this;

                    this.image                      = new Image ( );
                    this.image.crossOrigin          = "";
                    this.innerTexture               = new renderPro.graphics.gl.Texture ( );
                    this.image.onload               = function texture_loaded ( ) 
                    {
                        self.innerTexture.load ( self.image );
                    };
                    if ( src !== null )
                        this.image.src              = src;

                    if ( Texture._currentTextureID == undefined )
                        Texture._currentTextureID   = 1;
                    this.textureID                  = Texture._currentTextureID;
                }
                
                unload ( ) : void
                {
                    this.innerTexture.unload (  );
                }

                load ( data: any, type: any, width: number, height: number )
                {
                    let asTypedArray: any           = null;
                    switch ( type )
                    {
                        case CoreType.BYTE:
                        case CoreType.UINT8:
                            asTypedArray            = new Uint8Array ( data );
                            this.innerTexture.loadFloatTexture ( asTypedArray, width, height );
                            break;
                        case CoreType.INT16:
                            asTypedArray            = new Int16Array ( data );
                            break;
                        case CoreType.UINT16:
                            asTypedArray            = new Uint16Array ( data );
                            break;
                        case CoreType.FLOAT32:
                            asTypedArray            = new Float32Array ( data );
                            this.innerTexture.loadFloatTexture ( asTypedArray, width, height );
                            break;
                        case CoreType.FLOAT64:
                            asTypedArray            = new Float64Array ( data );
                            break;
                    }
                }

                getTexPointer ( ) : any
                {
                    return this.innerTexture.texture;
                }
            }
        }
    }
}
namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export interface IRenderable {
                bufferData ( gl: WebGLRenderingContext ) : void;
                unload  ( ) : void;

                draw ( shaderProgram : renderPro.graphics.Effect, gl : WebGLRenderingContext ) : void;
                drawWithoutStateChanges ( shaderProgram : renderPro.graphics.Effect, gl : WebGLRenderingContext ) :  void;
                drawUnindexed ( shaderProgram : renderPro.graphics.Effect, gl : WebGLRenderingContext ) : void;
            }   
        }
    }
}
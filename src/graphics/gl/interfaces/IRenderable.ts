var s_RenderableIdentifier: number = 0;
namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export interface IRenderable {
                renderableID: number;
                effect: renderPro.graphics.Effect
                bufferData ( gl: WebGLRenderingContext ) : void;
                unload  ( ) : void;
                draw ( shaderProgram : renderPro.graphics.Effect, gl : WebGLRenderingContext ) : void;
                drawWithoutStateChanges ( shaderProgram : renderPro.graphics.Effect, gl : WebGLRenderingContext ) :  void;
                drawUnindexed ( shaderProgram : renderPro.graphics.Effect, gl : WebGLRenderingContext ) : void;
            }   
        }
    }
}
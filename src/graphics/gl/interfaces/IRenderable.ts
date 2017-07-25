var s_RenderableIdentifier: number = 0;
namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export interface IRenderable {
                renderableID: number;
                effect: renderPro.graphics.core.Effect
                texture: renderPro.graphics.core.Texture
                material: renderPro.graphics.core.Material
                state: renderPro.graphics.core.State
                bufferData ( gl: WebGLRenderingContext ) : void;
                unload  ( ) : void;
                draw ( shaderProgram : renderPro.graphics.core.Effect, gl : WebGLRenderingContext ) : void;
                drawWithStateChanges ( shaderProgram : renderPro.graphics.core.Effect, gl : WebGLRenderingContext ) :  void;
                drawWithoutStateChanges ( shaderProgram : renderPro.graphics.core.Effect, gl : WebGLRenderingContext ) :  void;
                drawUnindexed ( shaderProgram : renderPro.graphics.core.Effect, gl : WebGLRenderingContext ) : void;
            }   
        }
    }
}
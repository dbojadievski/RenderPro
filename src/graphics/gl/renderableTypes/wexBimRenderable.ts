//NOTE(Dino): Custom-designed renderable type, used only on wexBIM files.
namespace renderPro
{
    export namespace graphics
    {
        export namespace gl
        {
            export class WexBIMRenderable implements IRenderable
            {
                private wexHandle : any; //TODO(Dino): Rewrite the xTypes (model handle etc) in Typescript.
                renderableID: number;
                effect: renderPro.graphics.Effect
                constructor ( wexHandle: any, effect: renderPro.graphics.Effect )
                {
                    this.wexHandle                  = wexHandle;
                    this.effect                     = effect;
                    this.renderableID               = s_RenderableIdentifier++;
                }

                bufferData ( gl: WebGLRenderingContext ) : void
                {
                    //NOTE(Dino): At this point, the wexBIM model handle must be entirely loaded.
                    this.wexHandle._gl              = gl;
                    this.wexHandle.feedGPU ( );
                }

                unload ( ) : void
                {
                    //NOTE(Dino): Make sure none of these buffers are currently bound!

                    this.wexHandle._gl.deleteBuffer( this.wexHandle.normalBuffer );
                    this.wexHandle._gl.deleteBuffer( this.wexHandle.indexBuffer );
                    this.wexHandle._gl.deleteBuffer( this.wexHandle.productBuffer );
                    this.wexHandle._gl.deleteBuffer( this.wexHandle.styleBuffer );
                    this.wexHandle._gl.deleteBuffer( this.wexHandle.stateBuffer );
                    this.wexHandle._gl.deleteBuffer( this.wexHandle.transformationBuffer );

                    //NOTE(Dino): Make sure none of these textures are currently bound, also!
                    this.wexHandle._gl.deleteTexture( this.wexHandle.vertexTexture );
                    this.wexHandle._gl.deleteTexture( this.wexHandle.matrixTexture );
                    this.wexHandle._gl.deleteTexture( this.wexHandle.styleBuffer );
                    this.wexHandle._gl.deleteTexture( this.wexHandle.stateStyleTexture );
                }

                draw ( shaderProgram: renderPro.graphics.Effect, gl: WebGLRenderingContext )
                {
                    this.wexHandle._gl              = gl;
                    shaderProgram.use ( gl );
                    this.wexHandle.draw ( );
                }

                drawWithoutStateChanges ( shaderProgram: renderPro.graphics.Effect, gl: WebGLRenderingContext )
                {
                    //TODO(Dino): Update attributes. Found in the effect.
                    this.wexHandle.draw ( );
                }

                drawUnindexed ( shaderProgram: renderPro.graphics.Effect, gl: WebGLRenderingContext )
                {
                    this.wexHandle.drawProducts ( gl, 2 );
                }
            }
        }
    }
}
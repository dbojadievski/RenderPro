//NOTE(Dino): Custom-designed renderable type, used only on wexBIM files.
namespace renderPro
{
    export namespace graphics
    {
        export namespace gl
        {
            export class WexBIMRenderable implements IRenderable
            {
                private wexHandle : any //TODO(Dino): Rewrite the xTypes (model handle etc) in Typescript.
                renderableID: number
                effect: renderPro.graphics.core.Effect
                texture: renderPro.graphics.core.Texture
                material: renderPro.graphics.core.Material
                state: renderPro.graphics.core.State
                constructor ( wexHandle: any, texture : renderPro.graphics.core.Texture, material : renderPro.graphics.core.Material, state : renderPro.graphics.core.State, effect: renderPro.graphics.core.Effect)
                {
                    this.wexHandle                  = wexHandle;
                    this.effect                     = effect;
                    this.texture                    = texture;
                    this.material                   = material;
                    this.state                      = state;
                    this.renderableID               = s_RenderableIdentifier++;
                }

                bufferData ( gl: WebGLRenderingContext ) : void
                {
                    //NOTE(Dino): At this point, the wexBIM model handle must be entirely loaded.
                    this.wexHandle._gl              = gl;
                    this.wexHandle.feedGPU ( this.effect );
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
                draw ( shaderProgram: renderPro.graphics.core.Effect, gl: WebGLRenderingContext ) : void
                {
                    this.drawWithStateChanges ( shaderProgram, gl );
                }
                drawWithStateChanges ( shaderProgram : renderPro.graphics.core.Effect, gl : WebGLRenderingContext ) :  void
                {
                    this.wexHandle._gl              = gl;
                    shaderProgram.innerEffect.use ( gl );

                    // Get attribute pointers from effect
                    let pointers : any = {}
                    if ( shaderProgram.innerEffect.attributes["aNormal"]) pointers.normalAttrPointer = shaderProgram.innerEffect.attributes["aNormal"].location;
                    if ( shaderProgram.innerEffect.attributes["aVertexIndex"]) pointers.indexlAttrPointer= shaderProgram.innerEffect.attributes["aVertexIndex"].location;
                    if ( shaderProgram.innerEffect.attributes["aProduct"]) pointers.productAttrPointer = shaderProgram.innerEffect.attributes["aProduct"].location;
                    if ( shaderProgram.innerEffect.attributes["aState"]) pointers.stateAttrPointer = shaderProgram.innerEffect.attributes["aState"].location;
                    if ( shaderProgram.innerEffect.attributes["aStyleIndex"]) pointers.stateAttrPointer = shaderProgram.innerEffect.attributes["aStyleIndex"].location;
                    if ( shaderProgram.innerEffect.attributes["aTransformationIndex"]) pointers.transformationAttrPointer = shaderProgram.innerEffect.attributes["aTransformationIndex"].location;

                    this.wexHandle.setActive(pointers);
                    this.wexHandle.draw ( );
                }
                drawWithoutStateChanges ( shaderProgram: renderPro.graphics.core.Effect, gl: WebGLRenderingContext ) : void
                {
                    //TODO(Dino): Update attributes. Found in the effect.
                    this.wexHandle.draw ( );
                }

                drawUnindexed ( shaderProgram: renderPro.graphics.core.Effect, gl: WebGLRenderingContext ) : void
                {
                    this.wexHandle.drawProducts ( gl, 2 );
                }
            }
        }
    }
}
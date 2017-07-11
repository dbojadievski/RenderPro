namespace renderPro
{
    export namespace core
    {
        export namespace systems
        {
            export namespace renderers
            {
                export class WebGLRenderer implements renderPro.core.interfaces.ISystem
                {
                    m_glContext:        WebGLRenderingContext
                    m_eventSystem:      Application.Infrastructure.ProEventSystem
                    m_assetManager:     renderPro.core.systems.AssetManager
                    
                    m_scene:            renderPro.data.scene.Scene;
                    m_scenes:           any;

                    m_pMatrix:          Float32Array;
                    m_viewMatrix:       Float32Array;

                    m_origin:           Float32Array;

                    m_viewportWidth:    number;
                    m_viewportHeight:   number; 

                    m_renderSet:        renderPro.graphics.rendering.SortedRenderSet = new renderPro.graphics.rendering.SortedRenderSet ( );

                    // Variables used for statistics
                    m_timer:            number
                    m_drawCalls:        number;
                    m_programSwitches:  number;
                    m_textureSwitches:  number;
                    m_lastFrameTime:    number;
                    m_lblPerformance:   HTMLElement;
                    m_vendor:           string;
                    m_rendererName:     string;

                    private readonly FIELD_OF_VIEW: number  = 45.0;
                    private readonly DISTANCE_NEAR: number  = 0.1;
                    private readonly DISTANCE_FAR: number   = 20000;

                    constructor ( assetManager : renderPro.core.systems.AssetManager, eventSystem: Application.Infrastructure.ProEventSystem )
                    {
                        this.m_eventSystem          = eventSystem;
                        this.m_assetManager         = assetManager;

                        let canvas : HTMLCanvasElement  = document.getElementById ( "canvas" ) as HTMLCanvasElement;
                        this.m_lblPerformance           = document.getElementById ( 'lblPerformance' );

                        this.m_glContext                = canvas.getContext( "experimental-webgl" );
                        this.m_viewportWidth            = canvas.width;
                        this.m_viewportHeight           = canvas.height;
                        renderPro.graphics.gl.context = this.m_glContext;
                    }

                    private initScene ( ) : void
                    {
                        this.m_origin               = new Float32Array ( [ 0.0, 0.0, 0.0 ] );
                        this.m_scene                = new renderPro.data.scene.Scene ( );
                        
                        this.m_pMatrix               = mat4.create ( );
                        mat4.perspective ( this.m_pMatrix, this.FIELD_OF_VIEW, this.m_viewportWidth / this.m_viewportHeight, this.DISTANCE_NEAR, this.DISTANCE_FAR ) ;

                        const cameraPosition: Float32Array              = new Float32Array ( [ this.m_origin[ 0 ], this.m_origin[ 1 ], this.m_origin[ 2 ] + 9000 ] ); /* NOTE(Dino): The camera position is 9000 units z-wise because that's how our test models are set up. */
                        const cameralookAtDirection: Float32Array       = new Float32Array ( WorldDirection.FORWARD );
                        const camera: renderPro.graphics.scene.Camera   = new renderPro.graphics.scene.Camera ( cameraPosition, cameralookAtDirection  );
                        this.m_scene.addCamera ( camera );
                        
                        this.m_viewMatrix           = camera.getViewMatrix ( new Float32Array ( WorldDirection.UP ) );
                    }

                    private hasRenderable ( renderableID: number, renderables: Array<renderPro.graphics.gl.IRenderable> ) : boolean
                    {
                        let hasRenderable: boolean      = false;
                        
                        for ( let renderableIdx: number = 0; renderableIdx < renderables.length; renderableIdx++ )
                        {
                            let renderable: renderPro.graphics.gl.IRenderable = renderables[ renderableIdx ];
                            if ( renderable.renderableID === renderableID )
                            {
                                hasRenderable           = true;
                                break;
                            }
                        }

                        return hasRenderable;
                    }

                    /* Sort renderables by the following parameters:
                    *  - shaders
                    *  - diffuse textures
                    * Output is preserved in @param sortedRenderables.
                    */
                    private renderableSorterExperimental ( renderables : Array<renderPro.graphics.rendering.RenderableInstance>, sortedRenderables: renderPro.graphics.rendering.RenderInstanceDictionary) : void
                    {
                        for ( let currRenderableIdx = 0; currRenderableIdx < renderables.length; currRenderableIdx++ )
                        {
                            const currRenderable : renderPro.graphics.gl.IRenderable            = renderables[ currRenderableIdx ].renderable;
                            const currRenderableKeyEffect : renderPro.graphics.core.Effect      = ( currRenderable.effect );
                            const currRenderableKeyTexture : renderPro.graphics.core.Texture    = ( currRenderable.texture );

                            let effectDictionary : Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>  = sortedRenderables.getByKey ( currRenderableKeyEffect );
                            if ( effectDictionary == null )
                            {
                                let kvp : KeyValuePair<renderPro.graphics.core.Effect, Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>>  = new KeyValuePair ( currRenderableKeyEffect, new Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>> ( ) );
                                effectDictionary                                                = kvp.value;
                                sortedRenderables.push ( kvp );
                            }

                            let textureDictionary : Array<renderPro.graphics.rendering.RenderableInstance>  = effectDictionary.getByKey ( currRenderableKeyTexture );
                            if ( textureDictionary == null )
                            {
                                let kvp : KeyValuePair<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>> = new KeyValuePair ( currRenderableKeyTexture, [ ] );
                                textureDictionary                                               = kvp.value;
                                effectDictionary.push ( kvp );
                            }

                            textureDictionary.push ( renderables[ currRenderableIdx ] )
                        }
                    }

                    private initBuffers ( models: Array<renderPro.graphics.core.Model>, textures: Array<renderPro.graphics.core.Texture> ) : renderPro.graphics.rendering.SortedRenderSet
                    {
                        let sortedRenderSet: renderPro.graphics.rendering.SortedRenderSet     = new renderPro.graphics.rendering.SortedRenderSet ();
                        let unsortedRenderSet: renderPro.graphics.rendering.RenderSet         = new renderPro.graphics.rendering.RenderSet (); 
                        
                        /* Note(Dino):
                         * Here, we get prepared to start rendering.
                         *
                         * The first step that need be done is loading all relevant data to the graphics card.
                         * We need to be careful not to load the same data multiple times, however.
                         * Otherwise, we'd just be wasting VRAM.
                         */

                        let bufferedRenderables: Array<renderPro.graphics.gl.IRenderable> = new Array<renderPro.graphics.gl.IRenderable> ( );

                        var processModel = ( currModel: renderPro.graphics.core.Model, renderSet: renderPro.graphics.rendering.RenderSet, parentNode: renderPro.data.scene.SceneNode ) =>
                        {
                            for ( let currChildIndex = 0; currChildIndex < currModel.children.length; currChildIndex++ )
                                processModel.call ( this, currModel[ currChildIndex ], currModel[ currChildIndex ].renderables, parentNode );
                            
                            for ( var currRenderableIdx = 0; currRenderableIdx < currModel.renderables.length; currRenderableIdx++ )
                            {
                                let currRenderable: renderPro.graphics.gl.IRenderable       = currModel.renderables[ currRenderableIdx ];
                                
                                if ( !this.hasRenderable ( currRenderable.renderableID, bufferedRenderables ) )
                                {
                                    currRenderable.bufferData ( this.m_glContext );
                                    bufferedRenderables.push ( currRenderable );
                                }

                                /*
                                * Note(Dino):
                                * We need to separate renderable objects into transparent and opaque.
                                */

                                let sceneNode: renderPro.data.scene.SceneNode   = new renderPro.data.scene.SceneNode ( null );
                                sceneNode.transform                             = currModel.transform;
                                let renderableInstance: renderPro.graphics.rendering.RenderableInstance = new renderPro.graphics.rendering.RenderableInstance ( currRenderable, sceneNode );
                                parentNode.addChild ( sceneNode );

                                if ( currRenderable.state === renderPro.graphics.core.State.TRANSPARENT )
                                    renderSet.transparent.push ( renderableInstance );
                                else
                                    renderSet.opaque.push ( renderableInstance );
                            }
                        }

                        for ( let currModelIdx = 0; currModelIdx < models.length; currModelIdx++ )
                            processModel.call ( this, models[ currModelIdx ], unsortedRenderSet, this.m_scene.nodes );

                        /* Converting the renderables from model to renderable instances */
                        let renderableInstances: Array<renderPro.graphics.rendering.RenderableInstance>             = [ ];
                        for ( var renderableIdx             = 0; renderableIdx < this.m_assetManager.exportableScenes.renderables.length; renderableIdx++ ) 
                        {
                            this.m_assetManager.exportableScenes.renderables[ renderableIdx ].bufferData( this.m_glContext );
                                    
                            let sceneNode: renderPro.data.scene.SceneNode                           = new renderPro.data.scene.SceneNode ( null );
                            let renderableInstance: renderPro.graphics.rendering.RenderableInstance = new renderPro.graphics.rendering.RenderableInstance ( this.m_assetManager.exportableScenes.renderables[ renderableIdx ], sceneNode );
                            renderableInstances.push( renderableInstance );
                        }

                        /*
                        * Note(Dino):
                        * Computing absolute positions from the scene graph isn't all that expensive, but we'd still prefer avoiding it.
                        * To this end, every scene node has its own cached position, which reflects its calculated absolute position.
                        * This information is updated every time the 'update' function is called.
                        * We can use this information during render time, but do keep in mind that it may become stale.
                        * Take care to update it whenever appropriate.
                        *
                        */
                        this.m_scene.nodes.updateAll ( );

                        
                        // Sort and load the renderables into the renderer.
                        this.renderableSorterExperimental ( unsortedRenderSet.opaque, sortedRenderSet.opaque );
                        this.renderableSorterExperimental ( unsortedRenderSet.transparent, sortedRenderSet.transparent );
                        return sortedRenderSet;
                    }

                    private drawScene ( renderSet : renderPro.graphics.rendering.SortedRenderSet ) : void
                    {
                        let gl : WebGLRenderingContext              = this.m_glContext;

                        this.m_timer                                = Date.now ( );
                        this.m_drawCalls                            = 0;
                        this.m_programSwitches                      = 0;
                        this.m_textureSwitches                      = 0;

                        gl.viewport ( 0, 0, this.m_viewportWidth, this.m_viewportHeight );
                        gl.clear ( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

                        /* Note(Dino):
                        * We do rendering in two passes.
                        * First, we render all opaque objects in the scene.
                        * Then we render all transparent objects.

                        * This allows us to maintain at least partial transparency fidelity.

                        * The limitation to this is that we will only have transparency through a single object.
                        * For an example, looking at a door through a glass window will be correct.
                        * However, looking at that door through two glass windows placed one behind another will not be correct.
                        * In fact, in that case, the door will not be visible.
                        *
                        * The solution to this is sorting all objects by depth and then rendering in two passes.
                        * However, this prevents us from sorting by more performant criteria, such as program and texture switches.
                        * Also, the sorting would have to be done per-frame, which isn't affordable in our case.
                        */
                        /*
                        * Note(Dino):
                        * This is an experimental, optimized renderer.
                        * It saves time by minimizing GPGPU state changes.
                        */
                        
                        
                        for ( let currFxIdx  : number = 0; currFxIdx < renderSet.opaque.content.length; currFxIdx++ )
                        /* Opaque objects are rendered in this first pass. */
                        {
                            let byEffect : KeyValuePair<renderPro.graphics.core.Effect, Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>> = renderSet.opaque.content[ currFxIdx ];
                            if ( byEffect.value.content.length > 0 )
                            {
                                /* Switch GPGPU program state. */
                                let effect : renderPro.graphics.core.Effect     = byEffect.key;
                                effect.innerEffect.use ( gl );
                                // currentEffect                           = effect;
                                this.m_programSwitches++;

                                for ( let currTexIdx : number = 0; currTexIdx < byEffect.value.content.length; currTexIdx++ )
                                {
                                    let byTexture : KeyValuePair<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>  = byEffect.value.content[ currTexIdx ];
                                    if ( byTexture.value.length > 0 )
                                    {
                                        /* Switch GPGPU texture state. */
                                        gl.activeTexture ( gl.TEXTURE0 );
                                        gl.bindTexture ( gl.TEXTURE_2D, byTexture.key.getTexPointer ( ) );
                                        effect.innerEffect.uniforms[ "uSampler" ].updateValue(0);
                                        this.m_textureSwitches++;

                                        for ( var currRenderableIdx : number = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++ )
                                        {
                                            var renderableInstance : renderPro.graphics.rendering.RenderableInstance   = byTexture.value[ currRenderableIdx ];
                                            var renderable : renderPro.graphics.gl.IRenderable                  = renderableInstance.renderable;
                                            this.setUniforms( renderable, renderableInstance.sceneNode.cachedTransform, effect);
                                            renderable.drawWithoutStateChanges ( effect, gl );
                                            this.m_drawCalls;
                                        }
                                    }
                                }
                            }
                        }

                        for ( var currFxIdx : number = 0; currFxIdx < renderSet.transparent.content.length; currFxIdx++ )
                        /* Transparent objects are rendered in this second pass. */
                        {
                            let byEffect : KeyValuePair<renderPro.graphics.core.Effect, Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>> = renderSet.transparent.content[ currFxIdx ];
                            if ( byEffect.value.content.length > 0 )
                            {
                                /* Switch GPGPU program state. */
                                let effect : renderPro.graphics.core.Effect     = byEffect.key;
                                effect.innerEffect.use ( gl );
                                //currentEffect                           = effect;
                                this.m_programSwitches++;

                                for ( var currTexIdx : number = 0; currTexIdx < byEffect.value.content.length; currTexIdx++ )
                                {
                                    let byTexture : KeyValuePair<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>> = byEffect.value.content[ currTexIdx ];
                                    if ( byTexture.value.length > 0 )
                                    {
                                        /* Switch GPGPU texture state. */
                                        gl.activeTexture ( gl.TEXTURE0 );
                                        gl.bindTexture ( gl.TEXTURE_2D, byTexture.key.getTexPointer ( ) );
                                        effect.innerEffect.uniforms[ "sampler" ].updateValue(0);
                                        this.m_textureSwitches++;

                                        for ( let currRenderableIdx: number = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++ )
                                        {
                                            var renderableInstance : renderPro.graphics.rendering.RenderableInstance    = byTexture.value[ currRenderableIdx ];
                                            var renderable : renderPro.graphics.gl.IRenderable                          = renderableInstance.renderable;
                                            this.setUniforms( renderable, renderableInstance.sceneNode.cachedTransform, effect);
                                            renderable.drawWithoutStateChanges ( effect, gl );
                                            this.m_drawCalls;
                                        }
                                    }
                                }
                            }
                        }

                        this.m_lastFrameTime                    = ( Date.now ( ) - this.m_timer );
                        this.m_lblPerformance.innerHTML         = this.m_lastFrameTime + " ms, "
                                                                + this.m_programSwitches + " program switches, "
                                                                + this.m_textureSwitches + " texture switches, "
                                                                + this.m_drawCalls + " draw calls on "
                                                                + this.m_rendererName;
                    }
                    private setUniforms ( renderable : renderPro.graphics.gl.IRenderable, transform : Float32Array, effect : renderPro.graphics.core.Effect ) : void
                    {
                        let gl : WebGLRenderingContext              = this.m_glContext;

                        if ( effect.innerEffect.uniforms[ "uPMatrix" ] ) effect.innerEffect.uniforms[ "uPMatrix" ].updateValue(this.m_pMatrix);
                        if ( effect.innerEffect.uniforms[ "uMVMatrix" ] ) effect.innerEffect.uniforms[ "uMVMatrix" ].updateValue(this.m_viewMatrix);
                        if ( effect.innerEffect.uniforms[ "uMMatrix" ] ) effect.innerEffect.uniforms[ "uMMatrix" ].updateValue(transform);
                        
                        if ( effect.innerEffect.uniforms[ "uMaterial.ambient" ] ) effect.innerEffect.uniforms[ "uMaterial.ambient" ].updateValue(renderable.material.ambient );
                        if ( effect.innerEffect.uniforms[ "uMaterial.diffuse" ] ) effect.innerEffect.uniforms[ "uMaterial.diffuse" ].updateValue(renderable.material.diffuse );
                        if ( effect.innerEffect.uniforms[ "uMaterial.specular" ] ) effect.innerEffect.uniforms[ "uMaterial.specular" ].updateValue(renderable.material.specular );
                        if ( effect.innerEffect.uniforms[ "uMaterial.shininess" ] ) effect.innerEffect.uniforms[ "uMaterial.shininess" ].updateValue(renderable.material.shininess );

                        gl.activeTexture ( gl.TEXTURE0 );
                        gl.bindTexture ( gl.TEXTURE_2D, renderable.texture.getTexPointer ( ) );
                        if ( effect.innerEffect.uniforms[ "uSampler" ] ) effect.innerEffect.uniforms[ "uSampler" ].updateValue(0);
                    }

                    init () : void
                    {
                        let gl : WebGLRenderingContext  = this.m_glContext;

                        let floatTextures : any                  = gl.getExtension( "OES_texture_float" );
                        let floatTexturesLinearFilter : any      = gl.getExtension( "OES_texture_float_linear" );
                        if ( !floatTextures || !floatTexturesLinearFilter ) 
                        {
                            alert('No floating point texture support. Terminating program.');
                            return;
                        }

                        if (Application.Debug.IS_DEBUGGING_ENABLED) 
                        {
                            try
                            {
                                /*
                                * Note(Dino):
                                * This extension provides information regarding the hardware and software environment the application is running under.
                                * it is, unfortunately, not available at all times; the regular Firefox edition does not allow it.
                                * Edge and Chrome, however, have no issues with it.
                                *
                                * The 'vendor' field provides the information regarding browser vendor, but this is information we can get in other, more reliable ways.
                                * The 'renderer' field provides the make and model of the GPGPU the application is running on.
                                * For an example, 'Intel HD 4600' or 'nVidia GeForce 870m'.
                                */
                                let debugInfo                   = gl.getExtension('WEBGL_debug_renderer_info');
                                this.m_vendor                   = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                                this.m_rendererName             = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                                
                            } catch ( e )
                            {
                                throw e.message;
                            }
                        }

                        if ( !gl )
                            alert ( "Could not initialise WebGL, sorry :-(" );

                        this.initScene();
                        this.m_renderSet                        = this.initBuffers(this.m_assetManager.exportableScenes.models, this.m_assetManager.exportableScenes.models);

                        gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
                        gl.enable( gl.DEPTH_TEST );
                    }

                    update ( ) : void
                    {
                         this.drawScene(this.m_renderSet)
                    }
                }
            }
        }
    }
}
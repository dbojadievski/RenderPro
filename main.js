var publicScene;
var eventSystem                         = new Application.Infrastructure.ProEventSystem( );
var g_OpenGLContext;

( function ( )
{
    var gl;
    var currentEffect;
    var timer;
    var drawCalls                           = 0;
    var programSwitches                     = 0;
    var textureSwitches                     = 0;
    var lastFrameTime;

    var pMatrix                             = mat4.create ( );
    var viewMatrix                          = mat4.create ( );

    var camera;
    var scene;
    var scenes;
    var renderables                         =
    {
        opaque:                             [ ],
        transparent:                        [ ]
    };

    var origin                              = [ 0, 0, 0 ];

    var lblPerformance                      = document.getElementById ( 'lblPerformance' );
    var renderer;                           // GPU string.
    renderables.hasRenderable               = function ( renderableID )
    {
        var isContained                     = false;

        for ( var renderable in this )
            if ( renderable.renderableID ===  renderableID )
            {
                isContained                 = true;
                break;
            }

        return isContained;
    };

    function initGL ( canvas )
    {
        try
        {
            gl                              = canvas.getContext( "experimental-webgl" );
            gl.viewportWidth                = canvas.width;
            gl.viewportHeight               = canvas.height;
            renderPro.graphics.gl.context   = gl;
        } catch ( e )
        {
            throw e.message;
        }

        var floatTextures                   = gl.getExtension( "OES_texture_float" );
        var floatTexturesLinearFilter       = gl.getExtension( "OES_texture_float_linear" );
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
                var debugInfo                   = gl.getExtension('WEBGL_debug_renderer_info');
                var vendor                      = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                renderer                        = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                
            } catch ( e )
            {
                throw e.message;
            }
        }

        if ( !gl )
            alert ( "Could not initialise WebGL, sorry :-(" );
    }

    function getShader (gl, id )
    {
        var shaderScript        = null;
        for ( var shaderScriptIdx = 0; shaderScriptIdx < assets.shaders.length; shaderScriptIdx++ ) {
            if ( assets.shaders[ shaderScriptIdx ].id === id )
            {
                shaderScript    = assets.shaders[ shaderScriptIdx ]
                break;
            }
        }
        if ( !shaderScript )
            return null;

        var shader;
        if ( shaderScript.type === "FRAGMENT" )
            shader              = gl.createShader(gl.FRAGMENT_SHADER);
        else if ( shaderScript.type === "VERTEX" )
            shader              = gl.createShader(gl.VERTEX_SHADER);
        else
            return null;

        gl.shaderSource ( shader, shaderScript.content );
        gl.compileShader ( shader );

        if ( !gl.getShaderParameter ( shader, gl.COMPILE_STATUS ) )
        {
            alert( gl.getShaderInfoLog ( shader ) );
            return null;
        }

        return shader;
    }

    function initShaders ( )
    {
        var effects             = new Array ( );
        initEffect ( effects, "mainEffect", "0003", "0004" );
        return effects;
    }

    function initEffect ( effects, effectName, vertexShaderId, fragmentShaderId ) 
    {
        var fragmentShader      = getShader ( gl, fragmentShaderId );
        var vertexShader        = getShader ( gl, vertexShaderId );

        var effect              = new renderPro.graphics.Effect ( vertexShader, fragmentShader, gl );
        effects[ effectName ]   = effect;

        if ( !gl.getProgramParameter ( effect.programPointer, gl.LINK_STATUS ) )
        {
            alert ( "Could not initialise shaders" );
        }

        effect.uniforms[ "pMatrixUniform" ]             = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uPMatrix", renderPro.graphics.gl.UniformType.UNIFORM_MATRIX_4FV );
        effect.uniforms[ "mvMatrixUniform" ]            = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uMVMatrix", renderPro.graphics.gl.UniformType.UNIFORM_MATRIX_4FV );
        effect.uniforms[ "mMatrixUniform" ]             = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uMMatrix", renderPro.graphics.gl.UniformType.UNIFORM_MATRIX_4FV );

        effect.uniforms[ "materialAmbient" ]            = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uMaterial.ambient", renderPro.graphics.gl.UniformType.UNIFORM_4FV);
        effect.uniforms[ "materialDiffuse" ]            = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uMaterial.diffuse", renderPro.graphics.gl.UniformType.UNIFORM_4FV );
        effect.uniforms[ "materialSpecular" ]           = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uMaterial.specular", renderPro.graphics.gl.UniformType.UNIFORM_4FV );
        effect.uniforms[ "materialShininess" ]          = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uMaterial.shininess", renderPro.graphics.gl.UniformType.UNIFORM_1F );

        effect.uniforms[ "pointLightPosition" ]         = gl.getUniformLocation ( effect.programPointer, "uPointLight.position" );
        effect.uniforms[ "pointLightAmbient" ]          = gl.getUniformLocation ( effect.programPointer, "uPointLight.ambient" );
        effect.uniforms[ "pointLightDiffuse" ]          = gl.getUniformLocation ( effect.programPointer, "uPointLight.diffuse" );
        effect.uniforms[ "pointLightSpecular" ]         = gl.getUniformLocation ( effect.programPointer, "uPointLight.specular" );

        effect.uniforms[ "directionalLightDirection" ]  = gl.getUniformLocation ( effect.programPointer, "uDirectionalLight.direction" );
        effect.uniforms[ "directionalLightAmbient" ]    = gl.getUniformLocation ( effect.programPointer, "uDirectionalLight.ambient" );
        effect.uniforms[ "directionalLightDiffuse" ]    = gl.getUniformLocation ( effect.programPointer, "uDirectionalLight.diffuse" );
        effect.uniforms[ "directionalLightSpecular" ]   = gl.getUniformLocation ( effect.programPointer, "uDirectionalLight.specular" );

        effect.uniforms[ "sampler" ]                    = new renderPro.graphics.gl.Uniform(gl, effect.programPointer, "uSamplers", renderPro.graphics.gl.UniformType.UNIFORM_1I );

        effect.attributes[ "vertexNormal" ]             = gl.getAttribLocation ( effect.programPointer, "aVertexNormal" );
        effect.attributes[ "vertexPosition" ]           = gl.getAttribLocation ( effect.programPointer, "aVertexPosition" );
        effect.attributes[ "vertexTextureCoordinate" ]  = gl.getAttribLocation ( effect.programPointer, "aVertexTextureCoordinate" );

        gl.enableVertexAttribArray ( effect.attributes[ "vertexNormal" ] );
        gl.enableVertexAttribArray ( effect.attributes[ "vertexPosition" ] );
        gl.enableVertexAttribArray ( effect.attributes[ "vertexTextureCoordinate" ] );


        effect.use ( gl );
        currentEffect                                       = effect;

        return effect;
    }

    function initScene ( scenes )
    {
        scene                                  = new renderPro.data.scene.Scene ( );

        mat4.perspective ( pMatrix , 45, gl.viewportWidth / gl.viewportHeight, 0.1, 20000.0 ) ;

        var cameraPosition                     = new Float32Array ( [ origin[0], origin[1], origin[0] + 9000 ] );
        // var cameraPosition                     = origin;
        var cameralookAtDirection              = WorldDirection.FORWARD;
        var camera                             = new renderPro.graphics.scene.Camera ( cameraPosition, cameralookAtDirection  );
        scene.addCamera ( camera );
        viewMatrix                             = camera.getViewMatrix ( WorldDirection.UP );
    }

    function setUniforms ( renderable, transform )
    {
        currentEffect.uniforms[ "pMatrixUniform" ].update(pMatrix);
        currentEffect.uniforms[ "mvMatrixUniform" ].update(viewMatrix);
        currentEffect.uniforms[ "mMatrixUniform" ].update(transform);
        
        currentEffect.uniforms[ "materialAmbient" ].update(renderable.material.ambient );
        currentEffect.uniforms[ "materialDiffuse" ].update(renderable.material.diffuse );
        currentEffect.uniforms[ "materialSpecular" ].update(renderable.material.specular );
        currentEffect.uniforms[ "materialShininess" ].update(renderable.material.shininess );

        
        gl.activeTexture ( gl.TEXTURE0 );
        gl.bindTexture ( gl.TEXTURE_2D, renderable.texture.getTexPointer ( ) );
        currentEffect.uniforms[ "sampler" ].update(0);
    }

    var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;

    function initBuffers ( models, textures )
    {
        var renderSet                           = 
        {
            opaque:                             new Dictionary ( ),
            transparent:                        new Dictionary ( )
        };

        /* Note(Dino):
        * Here, we get prepared to start rendering.
        *
        * The first step that need be done is loading all relevant data to the graphics card.
        * We need to be careful not to load the same data multiple times, however.
        * Otherwise, we'd just be wasting VRAM.
        */
        var bufferedRenderables                 = [ ];
        bufferedRenderables.hasRenderable       = function ( renderableID )
        {
            var isContained                     = false;

            for ( var renderable in this )
                if ( renderable.renderableID ===  renderableID )
                {
                    isContained                 = true;
                    break;
                }

            return isContained;
        };

        function processModel ( currModel, renderables, parentNode )
        {
            for ( var currChildIndex = 0; currChildIndex < currModel.children.length; currChildIndex++ )
                processModel ( currModel[ currChildIndex ], currModel[ currChildIndex ].renderables , parentNode );

            for ( var currRenderableIdx = 0; currRenderableIdx < currModel.renderables.length; currRenderableIdx++ )
            {
                var currRenderable              = currModel.renderables[ currRenderableIdx ];

                if ( !bufferedRenderables.hasRenderable ( currRenderable.renderableID ) )
                {
                    currRenderable.bufferData ( gl );
                    bufferedRenderables.push ( currRenderable );
                }

                /*
                * Note(Dino):
                * We need to separate renderable objects into transparent and opaque.
                */

                var sceneNode               = new renderPro.data.scene.SceneNode ( null );
                sceneNode.transform         = currModel.transform;
                var renderableInstance      = new renderPro.graphics.rendering.RenderableInstance ( currRenderable, sceneNode );
                parentNode.addChild ( sceneNode );

                if ( currRenderable.state === renderPro.graphics.core.State.TRANSPARENT )
                    renderables.transparent.push ( renderableInstance );
                else
                    renderables.opaque.push ( renderableInstance );
            }
        }

        for ( var currModelIdx = 0; currModelIdx < models.length; currModelIdx++ )
            processModel ( models[ currModelIdx ], renderables, scene.nodes );

        /* Converting the renderables from model to renderable instances */
        var renderableInstances             = [ ];
        for ( var renderableIdx             = 0; renderableIdx < scenes.renderables.length; renderableIdx++ ) 
        {
            scenes.renderables[ renderableIdx ].bufferData( gl );
                       
            var sceneNode                   = new renderPro.data.scene.SceneNode ( null );
            var renderableInstance          = new renderPro.graphics.rendering.RenderableInstance ( scenes.renderables[ renderableIdx ], sceneNode );
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
        scene.nodes.updateAll ( );

        /* Then we sort renderables by the following parameters:
        *  - shaders
        *  - diffuse textures
        */

        function renderableSorterExperimental ( renderables, sortedRenderables )
        {
            for ( var currRenderableIdx = 0; currRenderableIdx < renderables.length; currRenderableIdx++ )
            {
                var currRenderable                                                              = renderables[ currRenderableIdx ].renderable;
                var currRenderableKeyEffect                                                     = ( currRenderable.effect );
                var currRenderableKeyTexture                                                    = ( currRenderable.texture );

                var effectDictionary        = sortedRenderables.getByKey ( currRenderableKeyEffect );
                if ( effectDictionary == null )
                {
                    var kvp                 = new KeyValuePair ( currRenderableKeyEffect, new Dictionary ( ) );
                    effectDictionary        = kvp.value;
                    sortedRenderables.push ( kvp );

                }

                var textureDictionary       = effectDictionary.getByKey ( currRenderableKeyTexture );
                if ( textureDictionary == null )
                {
                    var kvp                 = new KeyValuePair ( currRenderableKeyTexture, [ ] );
                    textureDictionary       = kvp.value;
                    effectDictionary.push ( kvp );
                }

                textureDictionary.push ( renderables[ currRenderableIdx ] )
            }
        }

        // Sort and load the renderables into the renderer.
        renderableSorterExperimental ( renderables.opaque, renderSet.opaque );
        renderableSorterExperimental ( renderables.transparent, renderSet.transparent );

        return renderSet;
    }

    function drawScene ( renderSet )
    {
        timer                                   = Date.now ( );
        drawCalls                               = 0;
        programSwitches                         = 0;
        textureSwitches                         = 0;
        gl.viewport ( 0, 0, gl.viewportWidth, gl.viewportHeight );
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

        for ( var currFxIdx = 0; currFxIdx < renderSet.opaque.content.length; currFxIdx++ )
        /* Opaque objects are rendered in this first pass. */
        {
            var byEffect                                = renderSet.opaque.content[ currFxIdx ];
            if ( byEffect.value.content.length > 0 )
            {
                /* Switch GPGPU program state. */
                var effect                              = byEffect.key;
                effect.use ( gl );
                currentEffect                           = effect;
                programSwitches++;

                for ( var currTexIdx = 0; currTexIdx < byEffect.value.content.length; currTexIdx++ )
                {
                    var byTexture                       = byEffect.value.content[ currTexIdx ];
                    if ( byTexture.value.length > 0 )
                    {
                        /* Switch GPGPU texture state. */
                        gl.activeTexture ( gl.TEXTURE0 );
                        gl.bindTexture ( gl.TEXTURE_2D, byTexture.key.getTexPointer ( ) );
                        currentEffect.uniforms[ "sampler" ].update(0);
                        textureSwitches++;

                        for ( var currRenderableIdx     = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++ )
                        {
                            var renderableInstance      = byTexture.value[ currRenderableIdx ];
                            var renderable              = renderableInstance.renderable;
                            setUniforms( renderable, renderableInstance.sceneNode.cachedTransform );
                            renderable.drawWithoutStateChanges ( currentEffect, gl );
                            ++drawCalls;
                        }
                    }
                }
            }
        }

        for ( var currFxIdx = 0; currFxIdx < renderSet.transparent.content.length; currFxIdx++ )
        /* Transparent objects are rendered in this second pass. */
        {
            var byEffect                                = renderSet.transparent.content[ currFxIdx ];
            if ( byEffect.value.content.length > 0 )
            {
                /* Switch GPGPU program state. */
                var effect                              = byEffect.key;
                effect.use ( gl );
                currentEffect                           = effect;
                ++programSwitches;

                for ( var currTexIdx = 0; currTexIdx < byEffect.value.content.length; currTexIdx++ )
                {
                    var byTexture                       = byEffect.value.content[ currTexIdx ];
                    if ( byTexture.value.length > 0 )
                    {
                        /* Switch GPGPU texture state. */
                        gl.activeTexture ( gl.TEXTURE0 );
                        gl.bindTexture ( gl.TEXTURE_2D, byTexture.key.getTexPointer ( ) );
                        currentEffect.uniforms[ "sampler" ].update(0);
                        ++textureSwitches;

                        for ( var currRenderableIdx     = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++ )
                        {
                            var renderableInstance      = byTexture.value[ currRenderableIdx ];
                            var renderable              = renderableInstance.renderable;
                            setUniforms( renderable, renderableInstance.sceneNode.cachedTransform );
                            renderable.drawWithoutStateChanges ( currentEffect, gl );
                            ++drawCalls;
                        }
                    }
                }
            }
        }

        lastFrameTime                           = ( Date.now ( ) - timer );
        lblPerformance.innerHTML                = lastFrameTime + " ms, "
                                                + programSwitches + " program switches, "
                                                + textureSwitches + " texture switches, "
                                                + drawCalls + " draw calls on "
                                                + renderer;
    }

    function init ( )
    {
        var canvas                              = document.getElementById ( "canvas" );
        initGL ( canvas );
        var shaders                             = initShaders ( "mainEffect", "0003", "0004");
        scenes                                  = initAssetManager ( shaders );
        initScene ( scenes );

        eventSystem.on("wexBimLoaded", function ( ) 
        { 
            var renderSet                           = initBuffers( scenes.models, scenes.textures );
            gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
            gl.enable( gl.DEPTH_TEST );
            (function animloop( )
            {
                requestAnimationFrame(animloop);
                drawScene ( renderSet );
            })();

        } );
        eventSystem.fire( "testEvent" );
    }

    init( );
 } ) ( );
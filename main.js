( function ( ) 
{
    var gl;
    var currentEffect;
    var timer;
    var lastFrameTime;

    var pMatrix                                 = mat4.create ( );
    var viewMatrix                               = mat4.create ( );

    var camera;

    var scene                   = new renderPro.graphics.scene.Scene ( );

    var effects                 = [ ];
    var renderables             = 
    {
        opaque:                 [ ],
        transparent:            [ ]
    };

    var sortedRenderables       = 
    {
        opaque:                 new Dictionary ( ),
        transparent:            new Dictionary ( )
    };

    var textures                = [ ];
    var models                  = [ ];
    var lights                  = 
    {
        pointLights: 
        [ 
            new renderPro.graphics.scene.lighting.PointLight 
            (
                [ 0.0, 0.0, 0.0 ], // Position
                [ 1.0, 0.0, 0.0 ], // Ambient
                [ 0.0, 0.0, 0.0 ], // Diffuse
                [ 0.0, 0.0, 0.0 ], // Specular,
                0.0, 0.0, 0.0 // Constant, linear and exponential attenuations.
            ) 
        ],
        directionalLights:
        [
            new renderPro.graphics.scene.lighting.DirectionalLight
            (
                [ 0, 0, -1 ], // Direction
                [ 1.0, 1.0, 0.0, 1.0 ], // Ambient
                [ 255.0, 255.0, 255.0, 1.0 ], // Diffuse
                [ 0.0, 0.0, 1.0, 1.0 ] // Specular
            )
        ]
    }


    var origin                  = [ 0, 0, 0 ];
    var cameraPosition          = [ 0.0, 0.0, 0.0];
    var cameralookAtDirection;

    var worldDirection          =
    {
        RIGHT:                  [ 1.0, 0.0, 0.0 ],
        UP:                     [ 0.0, 1.0, 0.0 ],
        FORWARD:                [ 0.0, 0.0, 1.0 ]
    };


    var lblPerformance          = document.getElementById ( 'lblPerformance' );
    var renderer;               // GPU string.
    renderables.hasRenderable   = function ( renderableID )
    {
        var isContained         = false;
        
        for ( var renderable in this )
            if ( renderable.renderableID ===  renderableID )
            {
                isContained     = true;
                break;
            }
        
        return isContained;
    };

    function initGL ( canvas ) 
    {
        try 
        {
            gl                  = canvas.getContext( "experimental-webgl" );
            gl.viewportWidth    = canvas.width;
            gl.viewportHeight   = canvas.height;

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

            renderPro.graphics.gl.context   = gl;            
        } catch ( e ) 
        {
        }
        
        if ( !gl ) 
            alert ( "Could not initialise WebGL, sorry :-(" );
    }

    function getShader (gl, id ) 
    {
        var shaderScript        = document.getElementById ( id );
        if ( !shaderScript ) 
            return null;

        var str                 = "";
        var k                   = shaderScript.firstChild;
        while ( k ) 
        {
            if ( k.nodeType == 3 )
                str             += k.textContent;
            k                   = k.nextSibling;
        }

        var shader;
        if ( shaderScript.type == "x-shader/x-fragment" ) 
            shader              = gl.createShader(gl.FRAGMENT_SHADER);
        else if ( shaderScript.type == "x-shader/x-vertex" )
            shader              = gl.createShader(gl.VERTEX_SHADER);
        else
            return null;

        gl.shaderSource ( shader, str );
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
        var fragmentShader      = getShader ( gl, "shader-fs" );
        var vertexShader        = getShader ( gl, "shader-vs" );

        var mainEffect          = new renderPro.graphics.Effect ( vertexShader, fragmentShader, gl );
        effects[ 'mainEffect']  = mainEffect;

        if ( !gl.getProgramParameter ( mainEffect.programPointer, gl.LINK_STATUS ) ) 
        {
            alert ( "Could not initialise shaders" );
        }

        mainEffect.uniforms[ "pMatrixUniform" ]             = gl.getUniformLocation ( mainEffect.programPointer, "uPMatrix" );
        mainEffect.uniforms[ "mvMatrixUniform" ]            = gl.getUniformLocation ( mainEffect.programPointer, "uMVMatrix" );
        mainEffect.uniforms[ "mMatrixUniform" ]             = gl.getUniformLocation ( mainEffect.programPointer, "uMMatrix" );

        mainEffect.uniforms[ "materialAmbient" ]            = gl.getUniformLocation ( mainEffect.programPointer, "uMaterial.ambient" );
        mainEffect.uniforms[ "materialDiffuse" ]            = gl.getUniformLocation ( mainEffect.programPointer, "uMaterial.diffuse" );
        mainEffect.uniforms[ "materialSpecular" ]           = gl.getUniformLocation ( mainEffect.programPointer, "uMaterial.specular" );
        mainEffect.uniforms[ "materialShininess" ]          = gl.getUniformLocation ( mainEffect.programPointer, "uMaterial.shininess" );

        mainEffect.uniforms[ "pointLightPosition" ]         = gl.getUniformLocation ( mainEffect.programPointer, "uPointLight.position" );
        mainEffect.uniforms[ "pointLightAmbient" ]          = gl.getUniformLocation ( mainEffect.programPointer, "uPointLight.ambient" );
        mainEffect.uniforms[ "pointLightDiffuse" ]          = gl.getUniformLocation ( mainEffect.programPointer, "uPointLight.diffuse" );
        mainEffect.uniforms[ "pointLightSpecular" ]         = gl.getUniformLocation ( mainEffect.programPointer, "uPointLight.specular" ); 
        
        mainEffect.uniforms[ "directionalLightDirection" ]  = gl.getUniformLocation ( mainEffect.programPointer, "uDirectionalLight.direction" );
        mainEffect.uniforms[ "directionalLightAmbient" ]    = gl.getUniformLocation ( mainEffect.programPointer, "uDirectionalLight.ambient" );
        mainEffect.uniforms[ "directionalLightDiffuse" ]    = gl.getUniformLocation ( mainEffect.programPointer, "uDirectionalLight.diffuse" );
        mainEffect.uniforms[ "directionalLightSpecular" ]   = gl.getUniformLocation ( mainEffect.programPointer, "uDirectionalLight.specular" );

        mainEffect.uniforms[ "eyePosition" ]                = gl.getUniformLocation ( mainEffect.programPointer, "uEyePosition" );
        
        mainEffect.uniforms[ "sampler" ]                    = gl.getUniformLocation ( mainEffect.programPointer, "uSampler" );

        mainEffect.attributes[ "vertexNormal" ]            = gl.getAttribLocation ( mainEffect.programPointer, "aVertexNormal" ); 
        mainEffect.attributes[ "vertexPosition" ]          = gl.getAttribLocation ( mainEffect.programPointer, "aVertexPosition" );
        mainEffect.attributes[ "vertexTextureCoordinate" ] = gl.getAttribLocation ( mainEffect.programPointer, "aVertexTextureCoordinate" );
        
        gl.enableVertexAttribArray ( mainEffect.attributes[ "vertexNormal" ] );
        gl.enableVertexAttribArray ( mainEffect.attributes[ "vertexPosition" ] );
        gl.enableVertexAttribArray ( mainEffect.attributes[ "vertexTextureCoordinate" ] );
        
        mainEffect.use ( gl );
        currentEffect                                       = mainEffect;
    }

    function initTextures ( )
    {
        var currTex                                         = new renderPro.graphics.core.Texture ( "assets\\textures\\crate.gif", gl );
        textures[ 'crate' ]                                 = currTex;

        currTex                                             = new renderPro.graphics.core.Texture ( "assets\\textures\\nehe.gif", gl );
        textures[ 'nehe' ]                                  = currTex;
    }

    function setUniforms ( renderable, transform ) 
    {
        gl.uniformMatrix4fv ( currentEffect.uniforms[ "pMatrixUniform" ], false, pMatrix );
        gl.uniformMatrix4fv ( currentEffect.uniforms[ "mvMatrixUniform" ], false, viewMatrix );
        gl.uniformMatrix4fv ( currentEffect.uniforms[ "mMatrixUniform"], false, transform );

        gl.uniform4fv ( currentEffect.uniforms[ "materialAmbient" ], renderable.material.ambient );
        gl.uniform4fv ( currentEffect.uniforms[ "materialDiffuse" ], renderable.material.diffuse );
        gl.uniform4fv ( currentEffect.uniforms[ "materialSpecular" ], renderable.material.specular );
        gl.uniform1f ( currentEffect.uniforms[ "materialShininess" ], renderable.material.shininess );

        gl.uniform3fv ( currentEffect.uniforms[ "eyePosition" ], cameraPosition );

        gl.uniform3fv ( currentEffect.uniforms[ "directionalLightDirection" ], lights.directionalLights[ 0 ].direction );
        gl.uniform4fv ( currentEffect.uniforms[ "directionalLightAmbient" ], lights.directionalLights[ 0 ].ambient );
        gl.uniform4fv ( currentEffect.uniforms[ "directionalLightSpecular"], lights.directionalLights[ 0 ].specular );

        gl.activeTexture ( gl.TEXTURE0 );
        gl.bindTexture ( gl.TEXTURE_2D, renderable.texture.innerTexture.texture );
        gl.uniform1i( currentEffect.uniforms[ "sampler" ], 0  );
    }

    var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;

    function initBuffers ( ) 
    {

        function generateTranslation ( ) 
        {
            var minX    = - 20;
            var maxX    = + 20;

            var minY    = - 20;
            var maxY    = + 20;

            var minZ    = -100.0;
            var maxZ    = -2.9;

            var x       = getRandomInRange ( minX, maxX );
            var y       = getRandomInRange ( minY, maxY );
            var z       = getRandomInRange ( minZ, maxZ );

            return [ x, y, z ];
        }
        var vertices                            = 
        [
            // Front face
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0,  1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, 1.0,  1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0, 1.0, 1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),

            // Back face
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0, -1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0, -1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),

            // The top face
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0, -1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0,  1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),

            // The bottom face.
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0, -1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0,  1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),

            // The right face.
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0, -1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0,  1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0,  1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),

            // The Left face.
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0,  1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0, -1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] )
        ];

        var cubeVertexIndices                   = 
        [
                0, 1, 2,      0, 2, 3,    // Front face
                4, 5, 6,      4, 6, 7,    // Back face
                8, 9, 10,     8, 10, 11,  // Top face
                12, 13, 14,   12, 14, 15, // Bottom face
                16, 17, 18,   16, 18, 19, // Right face
                20, 21, 22,   20, 22, 23  // Left face
        ];
        
        var squareMesh                          = new renderPro.graphics.core.Mesh ( vertices, 3, cubeVertexIndices, 36 );

        var squareRenderable                    = new renderPro.graphics.gl.Renderable ( squareMesh, textures[ "nehe" ], materialEmerald, renderPro.graphics.core.State.NORMAL, effects[ 'mainEffect' ] );
        var redSquareRenderable                 = new renderPro.graphics.gl.Renderable ( squareMesh, textures[ "crate" ], materialRuby, renderPro.graphics.core.State.NORMAL, effects[ "mainEffect" ] );

        var numModels                           = 150;
        for ( var i = 0; i < numModels; i++ )
        {
            var translation                     = generateTranslation ( );
            var generatedTransform              = mat4.create ( );
            mat4.identity ( generatedTransform );
            mat4.translate ( generatedTransform, translation );

            var generatedRenderable             = getRandomInRange ( 1, 2 ) % 2 == 0 ? squareRenderable: redSquareRenderable;
            var generatedModel                  = new renderPro.graphics.core.Model ( [ generatedRenderable ], generatedTransform, null )
            models.push ( generatedModel );
        }
        
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

        function processModel ( currModel, parentNode, renderables )
        {
            for ( var currChildIndex = 0; currChildIndex < currModel.children.length; currChildIndex++ )
                processModel ( currModel[ currChildIndex ], renderables );

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
                var sceneNode               = new renderPro.graphics.scene.SceneNode ( parentNode );
                sceneNode.transform         = currModel.transform;
                sceneNode.renderable        = currRenderable;
                parentNode.children.push ( sceneNode );

                var renderableInstance      = new renderPro.graphics.rendering.RenderableInstance ( sceneNode.renderable, sceneNode.transform );

                if ( currRenderable.state === renderPro.graphics.core.State.TRANSPARENT )
                    renderables.transparent.push ( renderableInstance );
                else
                    renderables.opaque.push ( renderableInstance );
            }
        }

        scene.transform                         = mat4.create ( );
        mat4.identity ( scene.transform );
        
        for ( var currModelIdx = 0; currModelIdx < models.length; currModelIdx++ )
            processModel ( models[ currModelIdx ], scene, renderables );

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

        renderableSorterExperimental ( renderables.opaque, sortedRenderables.opaque );
    }

    function initCamera ( )
    {
        mat4.perspective ( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix );
        
        cameraPosition                          = [ 0.0, 0.0, 0.0 ];
        cameralookAtDirection                   = [ 0.0, 0.0, - 1.0 ];
        camera                                  = new renderPro.graphics.Camera ( cameraPosition, cameralookAtDirection  );
        viewMatrix                              = camera.getViewMatrix ( [ 0.0, 1.0, 0.0 ] );
    }

    function drawScene ( ) 
    {
        timer                                   = Date.now ( );
        var drawCalls                           = 0;
        var programSwitches                     = 0;
        var textureSwitches                     = 0;
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

        for ( var currFxIdx = 0; currFxIdx < sortedRenderables.opaque.content.length; currFxIdx++ )
        /* Opaque objects are rendered in this first pass. */
        {
            var byEffect                                = sortedRenderables.opaque.content[ currFxIdx ];
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
                        gl.bindTexture ( gl.TEXTURE_2D, byTexture.key.innerTexture.texture );
                        gl.uniform1i( currentEffect.uniforms[ "sampler" ], 0  );
                        textureSwitches++;

                        for ( var currRenderableIdx     = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++ )
                        { 
                            var renderableInstance      = byTexture.value[ currRenderableIdx ];
                            var renderable              = renderableInstance.renderable;
                            setUniforms( renderable, renderableInstance.transform );
                            renderable.drawWithoutStateChanges ( currentEffect, gl );
                            ++drawCalls;
                        }
                    }
                }
            }
        }

        for ( var currFxIdx = 0; currFxIdx < sortedRenderables.transparent.content.length; currFxIdx++ )
        /* Transparent objects are rendered in this second pass. */
        {
            var byEffect                                = sortedRenderables.transparent.content[ currFxIdx ];
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
                        gl.bindTexture ( gl.TEXTURE_2D, byTexture.key.innerTexture.texture );
                        gl.uniform1i( currentEffect.uniforms[ "sampler" ], 0  );
                        ++textureSwitches;

                        for ( var currRenderableIdx     = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++ )
                        { 
                            var renderableInstance      = byTexture.value[ currRenderableIdx ];
                            var renderable              = renderableInstance.renderable;
                            setUniforms( renderable, renderableInstance.transform );
                            renderable.drawWithoutStateChanges ( currentEffect, gl );
                            ++drawCalls;
                        }
                    }
                }
            }
        }

        lastFrameTime                           = ( Date.now ( ) - timer );
        lblPerformance.innerHTML                = "<b> " + lastFrameTime + "</b> ms.\n"
                                                + "<b>" + programSwitches + "</b> program switches.\n"
                                                + "<b>" + textureSwitches + "</b> texture switches.\n"
                                                + "<b>" + drawCalls + "</b> draw calls.\n"
                                                + renderer + ".\n";
    }

    function initWebGL ( ) 
    {
        var canvas                              = document.getElementById ( "canvas" );
        initGL ( canvas );
        initTextures ( );
        initShaders ( );
        initBuffers ( );
        initCamera ( );
        gl.clearColor ( 0.0, 0.0, 0.0, 1.0 );
        gl.enable ( gl.DEPTH_TEST );

        (function animloop()
        {
            requestAnimationFrame(animloop);
            drawScene ( );
        })();
    }

    initWebGL ( );
 } ) ( );
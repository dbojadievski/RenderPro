var publicScene;
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
    var effects                             = [ ];
    var renderables                         = 
    {
        opaque:                             [ ],
        transparent:                        [ ]
    };

    var sortedRenderables                   = 
    {
        opaque:                             new Dictionary ( ),
        transparent:                        new Dictionary ( )
    };

    var textures                            = [ ];
    var models                              = [ ];

    var origin                              = [ 0, 0, 0 ];
    var cameraPosition                      = [ 0.0, 0.0, 0.0 ];
    var cameralookAtDirection;

    var worldDirection                      =
    {
        RIGHT:                              [ 1.0, 0.0, 0.0 ],
        UP:                                 [ 0.0, 1.0, 0.0 ],
        FORWARD:                            [ 0.0, 0.0, 1.0 ]
    };


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

    function initAssetManager ( )
    {
        var exportableScenes                = 
        {
            textures:                       [ ],
            materials:                      [ ],
            meshes:                         [ ],
            models:                         [ ],
            renderables: [ ]
        };
        
        exportableScenes.textures.findByName = function init_asset_manager_local_find_tex_by_name ( name )
        {
            var tex                         = null;
            for ( var currTexIdx = 0; currTexIdx < this.length; currTexIdx++ )
                if ( name === this[ currTexIdx ].name )
                {
                    tex                     = this[ currTexIdx ];
                    break; 
                }

            return tex;
        };

        exportableScenes.textures.findById = function init_asset_manager_local_find_tex_by_id ( id )
        {
            var tex                         = null;
            for ( var currTexIdx = 0; currTexIdx < this.length; currTexIdx++ )
                if ( id === this[ currTexIdx ].textureID )
                {
                    tex                     = this[ currTexIdx ];
                    break; 
                }

            return tex;
        };

        exportableScenes.materials.findById = function init_asset_manager_local_find_material_by_id ( id )
        {
            var mtl                         = null;
            for ( var currMtlIdx = 0; currMtlIdx < this.length; currMtlIdx++ )
                if ( id === this[ currMtlIdx ].materialID )
                {
                    mtl                     = this[ currMtlIdx ];
                    break;
                }

            return mtl;
        };

        exportableScenes.materials.findByName = exportableScenes.textures.findByName; // HACK THE PLANEEEEEEEEEEEEEEET!

        exportableScenes.meshes.findById = function init_asset_manager_local_find_mesh_by_id ( id )
        {
            var mesh                        = null;
            for ( var currMeshIdx = 0; currMeshIdx < this.length; currMeshIdx++ )
                if ( id === this[ currMeshIdx ].meshID )
                {
                    mesh                    = this[ currMeshIdx ];
                    break;
                }

                return mesh;
        };

        /*
            * NOTE(Dino):
            * We have three main asset types: textures, materials, and models.
            *
            *  Every asset type may contain references to the one beforehand.
            * Thus, a material may contain references to textures as maps,
            * and a model may contain references to materials. 
            *  
            * This means that they should be loaded in series, and in that order.
         */
        for ( var currTexIdx = 0; currTexIdx < assets.textures.length; currTexIdx++ )
        {
            var tex                         = assets.textures[ currTexIdx ];
            var coreTex                     = new renderPro.graphics.core.Texture ( tex.content );
            coreTex.textureID               =  ( parseInt ( tex.id ) - 1000 ) ;
            coreTex.name                    = tex.content;
            exportableScenes.textures.push ( coreTex );
        }

        for ( var currMtlIdx = 0; currMtlIdx < assets.materials.length; currMtlIdx++ )
        /* TODO(Dino): every material file can contain multiple materials, but this isn't recognized in this function.  */
        {
            var mtl                         = assets.materials[ currMtlIdx ];
            var innerMtl                    = renderPro.importers.loadMaterialFromMaterialFile ( mtl.content );
            Application.Debug.assert ( innerMtl.length === 1, "INVALID CONTENT: Export tool supports only one material per material file." );
            innerMtl                        = innerMtl[ 0 ];
            var ambient                     = [ innerMtl.ambient.red, innerMtl.ambient.green, innerMtl.ambient.blue ];
            var diffuse                     = [ innerMtl.diffuse.red, innerMtl.diffuse.green, innerMtl.diffuse.blue ];
            var specular                    = [ innerMtl.specular.red, innerMtl.specular.green, innerMtl.specular.blue ];

            var coreMtl                     = new renderPro.graphics.core.Material ( ambient, diffuse, specular, innerMtl.shininess );

            if ( innerMtl.diffuseMap !== null )
            {
                var mapCoreTex              = exportableScenes.textures.findByName ( innerMtl.diffuseMap.name );
                Application.Debug.assert ( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                coreMtl.diffuseMap          = 
                {
                    texture:                mapCoreTex,
                    
                    base:                   innerMtl.diffuseMap.base,
                    gain:                   innerMtl.diffuseMap.gain,

                    blendU:                 innerMtl.diffuseMap.blendU,
                    blendV:                 innerMtl.diffuseMap.blendV,

                    originOffset:           innerMtl.diffuseMap.originOffset,
                    scale:                  innerMtl.diffuseMap.scale,
                    turbulence:             innerMtl.diffuseMap.turbulence,

                    clamp:                  innerMtl.diffuseMap.clamp

                };

                if ( innerMtl.diffuseMap.textureResolution !== undefined && innerMtl.diffuseMap.textureResolution !== null )
                    coreMtl.diffuseMap.resolution   = innerMtl.diffuseMap.textureResolution;
            }

            if ( innerMtl.ambientMap !== null )
            {
                var mapCoreTex              = exportableScenes.textures.findByName ( innerMtl.ambientMap.name );
                Application.Debug.assert ( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                coreMtl.ambientMap          = 
                {
                    texture:                mapCoreTex,
                    
                    base:                   innerMtl.ambientMap.base,
                    gain:                   innerMtl.ambientMap.gain,

                    blendU:                 innerMtl.ambientMap.blendU,
                    blendV:                 innerMtl.ambientMap.blendV,

                    originOffset:           innerMtl.ambientMap.originOffset,
                    scale:                  innerMtl.ambientMap.scale,
                    turbulence:             innerMtl.ambientMap.turbulence,

                    clamp:                  innerMtl.ambientMap.clamp

                };

                if ( innerMtl.ambientMap.textureResolution !== undefined && innerMtl.ambientMap.textureResolution !== null )
                    coreMtl.ambientMap.resolution   = innerMtl.ambientMap.textureResolution;
            }

            if ( innerMtl.specularMap !== null )
            {
                var mapCoreTex              = exportableScenes.textures.findByName ( innerMtl.specularMap.name );
                Application.Debug.assert ( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                coreMtl.specularMap          = 
                {
                    texture:                mapCoreTex,
                    
                    base:                   innerMtl.specularMap.base,
                    gain:                   innerMtl.specularMap.gain,

                    blendU:                 innerMtl.specularMap.blendU,
                    blendV:                 innerMtl.specularMap.blendV,

                    originOffset:           innerMtl.specularMap.originOffset,
                    scale:                  innerMtl.specularMap.scale,
                    turbulence:             innerMtl.specularMap.turbulence,

                    clamp:                  innerMtl.specularMap.clamp

                };

                if ( innerMtl.specularMap.textureResolution !== undefined && innerMtl.specularMap.textureResolution !== null )
                    coreMtl.specularMap.resolution   = innerMtl.specularMap.textureResolution;
            }

            if ( innerMtl.alphaMap !== null )
            {
                var mapCoreTex              = exportableScenes.textures.findByName ( innerMtl.alphaMap.name );
                Application.Debug.assert ( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                coreMtl.alphaMap            = 
                {
                    texture:                mapCoreTex,
                    
                    base:                   innerMtl.alphaMap.base,
                    gain:                   innerMtl.alphaMap.gain,

                    blendU:                 innerMtl.alphaMap.blendU,
                    blendV:                 innerMtl.alphaMap.blendV,
                    clamp:                  innerMtl.alphaMap.clamp,

                    originOffset:           innerMtl.alphaMap.originOffset,
                    scale:                  innerMtl.alphaMap.scale,
                    turbulence:             innerMtl.alphaMap.turbulence

                };

                if ( innerMtl.alphaMap.textureResolution !== undefined && innerMtl.alphaMap.textureResolution !== null )
                    coreMtl.alphaMap.resolution   = innerMtl.alphaMap.textureResolution;
            }

            coreMtl.materialID              = ( parseInt ( mtl.id ) - 2000 );
            coreMtl.name                    = innerMtl.name;
            exportableScenes.materials.push ( coreMtl );
        }

        for ( var currModelIdx = 0; currModelIdx < assets.models.length; currModelIdx++ )
        {
            var str                         = assets.models[ currModelIdx ].content;
            var model                       = renderPro.importers.loadGeometryFromObjectFile ( str );
            Application.Debug.assert ( model !== null, "Model parse from OBJ failed." );
            for ( var modelIdx = 0; modelIdx < model.length; modelIdx++ )
            {
                var subModel                = model[ modelIdx ];
                for ( var faceIdx = 0; faceIdx < subModel.faces.length; faceIdx++ )
                {
                    if ( subModel.faces[ faceIdx ] !== null )
                    /* By .obj specification, the default material for a face is a matte white material.  */
                    {
                        var mtl             = exportableScenes.materials.findByName ( subModel.faces[ faceIdx ].material );
                        subModel.faces[ faceIdx ].material = mtl !== null ? mtl : materialWhite;
                    }
                }
                exportableScenes.models.push ( subModel );
            }
        }


        /* 
         * TODO(Dino): Generate render constructs from these objects.
         * 
         * In renderPro, a 'renderable' is a set of all attributes 
         * that uniquely and completely specify how a mesh should be rendered.
         * This includes not just the mesh geometry, but also the material used.
         * The material also implicitly defines the shader to be used during rendering.
         * 
         * Materials are generally specified per-face, instead of per-'model'.
         * However, a model may not necessarily have different materials per face.
         * In this case, the entire model is a renderable.
         * Otherwise, all faces sharing a material comprise a renderable.
         */


        for ( var currModelIdx in exportableScenes.models )
        {
            var model                       = exportableScenes.models[ currModelIdx ];
            var materialMap                 = new Dictionary ( );
            for ( var faceIdx = 0; faceIdx < model.faces.length; faceIdx++ )
            {
                var faceMaterial            = model.faces[ faceIdx ].material;
                if ( !materialMap.hasKey ( faceMaterial.materialID ) )
                    materialMap.push ( new KeyValuePair ( faceMaterial.materialID, [ ] ) );
                var facesByMaterial = materialMap.getByKey ( faceMaterial.materialID );
                facesByMaterial.push ( model.faces[ faceIdx ] );
                
            }

            function processFaceGroup ( faceGroup )
            {
                console.log ( faceGroup );
                var vertexPositions         = [ ];
                var vertexNormals           = [ ];
                var vertexUVs               = [ ];

                for ( var faceIdx = 0; faceIdx < faceGroup.value.length; faceIdx++ )
                {
                    var face                = faceGroup.value[ faceIdx ];
                    for ( var vertexIdx = 0; vertexIdx < face.vertices.length; vertexIdx++ )
                    {

                    }
                    console.log ( face );
                }
            }
            /* NOTE(Dino): Separate by model, and not just by material ID. */
            materialMap.iterate (  processFaceGroup );

            // if ( materialMap.length ( ) === 1 )
            // {
            //     var vertexArray             = [ ];
            //     for ( var faceIdx = 0; faceIdx < model.faces.length; faceIdx++ )
            //     {
            //         var face                = model.faces[ faceIdx ];
            //         for ( var vertexIdx = 0; vertexIdx < face.vertices.length; vertexIdx++ )
            //             vertexArray.push ( new renderPro.graphics.core.Vertex ( face.vertices[ vertexIdx ].position, face.vertices[ vertexIdx ].textureCoordinates, face.vertices[ vertexIdx ].normal )  );

            //     }
            //     var usedMaterial            = model.faces[ 0 ].material;
            //     var __mesh                  = new renderPro.graphics.core.Mesh ( vertexArray, 3, [ ], 0 );
            //     var renderable              = new renderPro.graphics.gl.Renderable ( __mesh, usedMaterial.diffuseMap.texture, usedMaterial, renderPro.graphics.core.State.NORMAL, effects[ 'mainEffect' ] );
            //     exportableScenes.renderables.push ( renderable );
            // }
        }

        console.log ( exportableScenes );
        scenes                              = exportableScenes;
        return exportableScenes;
    }


    function initGL ( canvas ) 
    {
        try 
        {
            gl                              = canvas.getContext( "experimental-webgl" );
            gl.viewportWidth                = canvas.width;
            gl.viewportHeight               = canvas.height;

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

    function initLights ( scene ) 
    {
        var lights                                          = 
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
            ],
            spotLights: 
            [
            ]
        }

        for ( var currLightIdx = 0; currLightIdx < lights.pointLights.length; currLightIdx++ )
            scene.addLight ( lights.pointLights[ currLightIdx ] );

        for ( var currLightIdx = 0; currLightIdx < lights.directionalLights.length; currLightIdx++ )
            scene.addLight ( lights.directionalLights[ currLightIdx ] );

        for ( var currLightIdx = 0; currLightIdx < lights.spotLights.length; currLightIdx++ )
            scene.addLight ( lights.spotLights[ currLightIdx ] );
    }

    function initScene ( )
    {
        scene                                               = new renderPro.data.scene.Scene ( );
        initLights ( scene );
    }

    function initTextures ( )
    {
        var currTex                                         = new renderPro.graphics.core.Texture ( "assets\\textures\\crate.gif", gl );
        textures[ 'crate' ]                                 = currTex;

        currTex                                             = new renderPro.graphics.core.Texture ( "assets\\textures\\water.png", gl );
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

        gl.uniform3fv ( currentEffect.uniforms[ "directionalLightDirection" ], scene.lights.directionalLights[ 0 ].direction );
        gl.uniform4fv ( currentEffect.uniforms[ "directionalLightAmbient" ], scene.lights.directionalLights[ 0 ].ambient );
        gl.uniform4fv ( currentEffect.uniforms[ "directionalLightSpecular"], scene.lights.directionalLights[ 0 ].specular );

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

        function generateRotation ( )
        {
            var min                             = 0.0;
            var max                             = 359.0;

            var x                               = getRandomInRange ( min, max );
            var y                               = getRandomInRange ( min, max );
            var z                               = getRandomInRange ( min, max );

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
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0, -1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0, -1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),

            // The top face
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0,  1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),

            // The bottom face.
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0, -1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0,  1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0,  1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),

            // The right face.
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0, -1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0,  1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ 1.0, -1.0,  1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] ),

            // The Left face.
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0, -1.0 ], [ 0.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0, -1.0,  1.0 ], [ 1.0, 0.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0,  1.0 ], [ 0.0, 1.0 ], [ 0, 0, 0 ] ),
            new renderPro.graphics.core.Vertex ( [ -1.0,  1.0, -1.0 ], [ 1.0, 1.0 ], [ 0, 0, 0 ] )
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

            var rotation                        = generateRotation ( );
            mat4.rotateX ( generatedTransform, rotation[ 0 ] );
            mat4.rotateY ( generatedTransform, rotation[ 1 ] );
            mat4.rotateZ ( generatedTransform, rotation[ 2 ] );

            var generatedRenderable             = getRandomInRange ( 1, 2 ) % 2 == 0 ? squareRenderable: redSquareRenderable;
            var generatedModel                  = new renderPro.graphics.core.Model ( [ generatedRenderable ], generatedTransform, null )
            models.push ( generatedModel );
        }


        var someTransform                       = mat4.create ( );
        mat4.identity ( someTransform );

        scenes.renderables[ 0 ].mesh.indices    = cubeVertexIndices;
        scenes.renderables[ 0 ].mesh.indexSize  = 2;
        scenes.renderables[ 0 ].mesh.indexCount = cubeVertexIndices.length;

        var objModel                            = new renderPro.graphics.core.Model ( scenes.renderables, generatedTransform, null );
        // models.push ( objModel );
        
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

        /* Let's just inspect the scene graph. */

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

        renderableSorterExperimental ( renderables.opaque, sortedRenderables.opaque );

    }

    function initCamera ( )
    {
        mat4.perspective ( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix );
        
        cameraPosition                          = [ 0.0, 0.0, 0.0 ];
        cameralookAtDirection                   = [ 0.0, 0.0, - 1.0 ];
        camera                                  = new renderPro.graphics.scene.Camera ( cameraPosition, cameralookAtDirection  );
        viewMatrix                              = camera.getViewMatrix ( [ 0.0, 1.0, 0.0 ] );
    }

    function drawScene ( ) 
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
                            setUniforms( renderable, renderableInstance.sceneNode.cachedTransform );
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

        var error = gl.getError ( );
        if ( error != 0 )
            console.log ( error );

    }

    function initWebGL ( ) 
    {
        var canvas                              = document.getElementById ( "canvas" );
        initGL ( canvas );
        initShaders ( );
        initAssetManager ( );
        initTextures ( );
        initScene ( );
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
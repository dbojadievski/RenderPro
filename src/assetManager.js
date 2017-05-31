
function initAssetManager ( shaders )
{
    var exportableScenes                =
    {
        textures:                       [ ],
        materials:                      [ ],
        meshes:                         [ ],
        models:                         [ ],
        renderables:                    [ ],
        effects:                        shaders
    };

    var tempModels                      = [ ];
    
    initTextureFromArray ( );

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

    exportableScenes.meshes.findById    = function init_asset_manager_local_find_mesh_by_id ( id )
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
        * Every asset type may contain references to the one beforehand.
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
        coreTex.name                    = tex.content.substring ( tex.content.lastIndexOf ( '\\' ) + 1 );
        exportableScenes.textures.push ( coreTex );
    }

    for ( var currMtlIdx = 0; currMtlIdx < assets.materials.length; currMtlIdx++ )
    /* TODO(Dino): every material file can contain multiple materials, but this isn't recognized in this function.  */
    {
        var mtl                         = assets.materials[ currMtlIdx ];
        var innerMtl                    = renderPro.importers.loadMaterialFromMaterialFile ( mtl.content );
        Application.Debug.assert ( innerMtl.length === 1, "INVALID CONTENT: Export tool supports only one material per material file." );
        innerMtl                        = innerMtl[ 0 ];
        var ambient                     = innerMtl.ambient;
        var diffuse                     = innerMtl.diffuse;
        var specular                    = innerMtl.specular;

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
                    subModel.facesByMaterial 
                }
                
            }

            tempModels.push ( subModel );
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


    for ( var currModelIdx in tempModels )
    {
        var model                           = tempModels[ currModelIdx ];
        var materialMap                     = new Dictionary ( );
        for ( var faceIdx = 0; faceIdx < model.faces.length; faceIdx++ )
        {
            var faceMaterial                = model.faces[ faceIdx ].material;
            if ( !materialMap.hasKey ( faceMaterial.materialID ) )
                materialMap.push ( new KeyValuePair ( faceMaterial.materialID, [ ] ) );
            var facesByMaterial             = materialMap.getByKey ( faceMaterial.materialID );
            facesByMaterial.push ( model.faces[ faceIdx ] );
        }

        var vertexArray                     = [ ];
        var translation                     = [ 0, 0, -30 ];

        // Function to proces a single facegroup, to generate the renderable for each face.
        function processFaceGroup ( renderables, faceGroup)
        {
            var renderablesInFaceGroup = [];
            for ( var faceIdx               = 0; faceIdx < faceGroup.value.length; faceIdx++ )
            {
                var face                    = faceGroup.value[ faceIdx ];
                var actualVertexArray       = [ ];
                var indexArray              = [ ];
                for ( var vertexIdx         = 0; vertexIdx < face.vertices.length; vertexIdx++ )
                {
                    var exportableVertex    = face.vertices[ vertexIdx ];
                    var vPosArray           = new Float32Array ( exportableVertex.position );
                    var vUvArray            = new Float32Array ( exportableVertex.textureCoordinates );
                    var vNormArray          = new Int16Array ( exportableVertex.normal );
                    var coreVertex          = new renderPro.graphics.core.Vertex ( vPosArray, vUvArray, vNormArray );
                    actualVertexArray.push ( coreVertex );
                    indexArray.push ( vertexIdx );
                }

                var mesh                    = new renderPro.graphics.core.Mesh ( actualVertexArray, actualVertexArray.length, indexArray, indexArray.length );
                var usedMaterial            = model.faces[ faceIdx ].material;
                var renderable              = new renderPro.graphics.gl.Renderable 
                (
                    mesh,
                    usedMaterial.diffuseMap.texture,
                    usedMaterial,
                    renderPro.graphics.core.State.NORMAL,
                    exportableScenes.effects[ 'mainEffect' ] 
                );
                renderablesInFaceGroup.push ( renderable );
            }

            /* NOTE(Martin): Renderables combined using this method must use the same material */
            function combineRenderables ( renderables ) 
            {
                var combinedVertices        = [];
                var combinedIndices         = [];
                for ( var renderIdx = 0; renderIdx < renderables.length; renderIdx++ )
                 {
                    var currRenderable      = renderables[renderIdx];
                    var currMesh            = currRenderable.mesh;
                    var currAmountVertices  = combinedVertices.length;
                    
                    for ( var vertexIdx = 0; vertexIdx < currMesh.vertices.length; vertexIdx++ ) 
                    {
                        combinedVertices.push ( currMesh.vertices[vertexIdx] )
                    }

                    for ( var indexIdx = 0; indexIdx < currMesh.indices.length; indexIdx++ ) 
                    {
                        combinedIndices.push ( currMesh.indices[indexIdx] + currAmountVertices);
                    }
                }

                var combinedMesh            = new renderPro.graphics.core.Mesh ( 
                    combinedVertices, 
                    combinedVertices.length, 
                    combinedIndices, 
                    combinedIndices.length
                );

                var renderable              = new renderPro.graphics.gl.Renderable (
                    combinedMesh,
                    renderables[0].texture,
                    renderables[0].material,
                    renderPro.graphics.core.State.NORMAL,
                    exportableScenes.effects[ 'mainEffect' ] 
                );
                return renderable
            }

            renderables.push( combineRenderables(renderablesInFaceGroup));
        }


        /* NOTE(Dino): Separate by model, and not just by material ID. */
        var modelRenderables                = [ ];
        materialMap.iterate (  processFaceGroup.bind(null, modelRenderables ) );
        
        var modelTransformMatrix            = mat4.create ( );
        mat4.identity ( modelTransformMatrix );
        
        var translation                     = [ 0, 0, - 30 ];
        mat4.translate ( modelTransformMatrix, modelTransformMatrix, translation );
        
        var rotation                    = generateRotation ( );
        mat4.rotateX ( modelTransformMatrix, modelTransformMatrix, rotation[ 0 ] );
        mat4.rotateY ( modelTransformMatrix, modelTransformMatrix, rotation[ 1 ] );
        mat4.rotateZ ( modelTransformMatrix, modelTransformMatrix, rotation[ 2 ] );
        
        var coreModel                   = new renderPro.graphics.core.Model ( modelRenderables, modelTransformMatrix, null, model.name );
        for ( var currIdx = 0; currIdx < modelRenderables.length; currIdx++ )
            exportableScenes.renderables.push ( modelRenderables[ currIdx ] );

        exportableScenes.models.push ( coreModel );
    }

    scenes                              = exportableScenes;
    return exportableScenes;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*                Test functions. Do not call.             */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function initTextureFromArray ( )
{
    var rawData        = 
    [ 
        1.0, 0.0, 0.0, 1.0, 
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0 
    ];
    
    var data           = new Float32Array ( rawData );
    const coreTex      = new renderPro.graphics.core.Texture ( );
    coreTex.load ( data, CoreType.FLOAT32, 3, 1 );

    return coreTex;
}
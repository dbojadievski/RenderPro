namespace renderPro
{
    export namespace core
    {
        export namespace systems
        {
            export class AssetManager implements renderPro.core.interfaces.ISystem 
            {
                assets : any
                exportableScenes : any

                constructor (assets) 
                {
                    this.assets                         = assets;
                }
                init () 
                {
                    this.exportableScenes                =
                    {
                        textures:                       [ ],
                        materials:                      [ ],
                        meshes:                         [ ],
                        models:                         [ ],
                        renderables:                    [ ],
                        effects:                        [ ]
                    };

                    let tempModels                      = [ ];
                    
                    this.initTextureFromArray ( );

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
                    for ( let currTexIdx : number = 0; currTexIdx < this.assets.textures.length; currTexIdx++ )
                    {
                        let tex : any                                   = this.assets.textures[ currTexIdx ];
                        let coreTex : renderPro.graphics.core.Texture   = new renderPro.graphics.core.Texture( tex.content );
                        coreTex.textureID                               =  ( parseInt ( tex.id ) - 1000 ) ;
                        coreTex.name                                    = tex.content.substring( tex.content.lastIndexOf ( '\\' ) + 1 );
                        this.exportableScenes.textures.push ( coreTex );
                    }

                    for ( let currEffIdx : number = 0; currEffIdx < this.assets.effects.length; currEffIdx++ )
                    {
                        let effectObject : any          = this.assets.effects[ currEffIdx ];

                        let vertexShaderObject : any, fragmentShaderObject : any;
                        for ( let shaderScriptIdx : number = 0; shaderScriptIdx < this.assets.shaders.length; shaderScriptIdx++ ) {
                            if ( this.assets.shaders[ shaderScriptIdx ].id === effectObject.vertexShaderId )
                            {
                                vertexShaderObject      = this.assets.shaders[ shaderScriptIdx ]
                            }
                            if ( this.assets.shaders[ shaderScriptIdx ].id === effectObject.fragmentShaderId )
                            {
                                fragmentShaderObject    = this.assets.shaders[ shaderScriptIdx ]
                            }
                        }
                        if ( !vertexShaderObject || !fragmentShaderObject)
                            return null;

                        let coreEffect : renderPro.graphics.core.Effect     = new renderPro.graphics.core.Effect( effectObject.name, vertexShaderObject, fragmentShaderObject);
                        
                        this.exportableScenes.effects.push ( coreEffect );
                    }

                    for ( let currMtlIdx : number = 0; currMtlIdx < this.assets.materials.length; currMtlIdx++ )
                    /* TODO(Dino): every material file can contain multiple materials, but this isn't recognized in this function.  */
                    {
                        let mtl : any                   = this.assets.materials[ currMtlIdx ];
                        /* NOTE(Martin): renderPro is cast to 'any' to prevent a 'Property does not exist' compiler error
                        * caused by renderPro.importers being standard javascript.
                        * TODO: find a better solution to supress the error.
                        */
                        let innerMtl : any              = (renderPro as any).importers.loadMaterialFromMaterialFile ( mtl.content );
                        Application.Debug.assert ( innerMtl.length === 1, "INVALID CONTENT: Export tool supports only one material per material file." );
                        innerMtl                        = innerMtl[ 0 ];
                        let ambient                     = innerMtl.ambient;
                        let diffuse                     = innerMtl.diffuse;
                        let specular                    = innerMtl.specular;

                        let coreMtl : renderPro.graphics.core.Material  = new renderPro.graphics.core.Material( ambient, diffuse, specular, innerMtl.shininess );

                        if ( innerMtl.diffuseMap !== null )
                        {
                            let mapCoreTex : renderPro.graphics.core.Texture    = this.findTextureByName( innerMtl.diffuseMap.name );
                            Application.Debug.assert( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                            let diffuseMap : any = {
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
                                diffuseMap["resolution"]   = innerMtl.diffuseMap.textureResolution;
                            
                            coreMtl.textures.add("diffuseMap", diffuseMap);
                        }

                        if ( innerMtl.ambientMap !== null )
                        {
                            let mapCoreTex : renderPro.graphics.core.Texture    = this.findTextureByName( innerMtl.ambientMap.name );
                            Application.Debug.assert( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                            let ambientMap : any = {
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
                                ambientMap["resolution"]   = innerMtl.ambientMap.textureResolution;
                            
                            coreMtl.textures.add("ambientMap", ambientMap);
                        }

                        if ( innerMtl.specularMap !== null )
                        {
                            let mapCoreTex : renderPro.graphics.core.Texture    = this.findTextureByName ( innerMtl.specularMap.name );
                            Application.Debug.assert ( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                            let specularMap : any = {
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
                                specularMap["resolution"]   = innerMtl.specularMap.textureResolution;
                            
                            coreMtl.textures.add("specularMap", specularMap);
                        }

                        if ( innerMtl.alphaMap !== null )
                        {
                            let mapCoreTex : renderPro.graphics.core.Texture    = this.findTextureByName( innerMtl.alphaMap.name );
                            Application.Debug.assert( mapCoreTex !== null, "INVALID CONTENT: Texture map missing." );
                            let alphaMap : any = {
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
                                alphaMap["resolution"]   = innerMtl.alphaMap.textureResolution;
                            
                            coreMtl.textures.add("alphaMap", alphaMap);
                        }

                        coreMtl.materialID              = ( parseInt ( mtl.id ) - 2000 );
                        coreMtl.name                    = innerMtl.name;
                        this.exportableScenes.materials.push( coreMtl );
                    }

                    for ( let currModelIdx : number = 0; currModelIdx < this.assets.models.length; currModelIdx++ )
                    {
                        let str : string                = this.assets.models[ currModelIdx ].content;
                        /* NOTE(Martin): renderPro is cast to 'any' to prevent a 'Property does not exist' compiler error
                        * caused by renderPro.importers being standard javascript.
                        * TODO: find a better solution to supress the error.
                        */
                        let model : any                 = (renderPro as any).importers.loadGeometryFromObjectFile( str );
                        Application.Debug.assert( model !== null, "Model parse from OBJ failed." );
                        for ( let modelIdx : number = 0; modelIdx < model.length; modelIdx++ )
                        {
                            let subModel : any              = model[ modelIdx ];
                            for ( let faceIdx : number = 0; faceIdx < subModel.faces.length; faceIdx++ )
                            {
                                if ( subModel.faces[ faceIdx ] !== null )
                                /* By .obj specification, the default material for a face is a matte white material.  */
                                {
                                    let mtl : renderPro.graphics.core.Material  = this.findMaterialByName( subModel.faces[ faceIdx ].material );
                                    /* NOTE(Martin): renderPro is cast to 'any' to prevent a 'Property does not exist' compiler error
                                    * caused by renderPro.assets being standard javascript.
                                    * TODO: find a better solution to supress the error.
                                    */
                                    subModel.faces[ faceIdx ].material  = mtl !== null ? mtl : (renderPro as any).assets.materials.materialWhite;
                                    subModel.facesByMaterial 
                                }
                            }

                            tempModels.push( subModel );
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
                    for ( let currModelIdx : number = 0;  currModelIdx<tempModels.length;  currModelIdx++)
                    {
                        let model : any                     = tempModels[ currModelIdx ];
                        let materialMap : Dictionary<string, Array<any>> = new Dictionary<string, Array<any>>( );
                        for ( let faceIdx = 0; faceIdx < model.faces.length; faceIdx++ )
                        {
                            let faceMaterial : any          = model.faces[ faceIdx ].material;
                            if ( !materialMap.hasKey( faceMaterial.materialID ) )
                                materialMap.push( new KeyValuePair<string, Array<any>>( faceMaterial.materialID, [ ] ) );
                            let facesByMaterial             = materialMap.getByKey( faceMaterial.materialID );
                            facesByMaterial.push( model.faces[ faceIdx ] );
                        }

                        let vertexArray : Array<any>                    = [ ];

                       /* NOTE(Dino): Separate by model, and not just by material ID. */
                        let modelRenderables : Array<any>               = [ ];
                        materialMap.iterate(  this.processFaceGroup.bind(this, model, modelRenderables ) );
                        
                        let modelTransformMatrix : Float32Array         = mat4.create( );
                        mat4.identity( modelTransformMatrix );
                        
                        let translation : Float32Array                  = new Float32Array([ 0, 0, -30+9000 ]);
                        mat4.translate( modelTransformMatrix, modelTransformMatrix, translation );
                        
                        let rotation : Array<number>                    = generateRotation( );
                        mat4.rotateX( modelTransformMatrix, modelTransformMatrix, rotation[ 0 ] );
                        mat4.rotateY( modelTransformMatrix, modelTransformMatrix, rotation[ 1 ] );
                        mat4.rotateZ( modelTransformMatrix, modelTransformMatrix, rotation[ 2 ] );
                        
                        let coreModel : renderPro.graphics.core.Model   = new renderPro.graphics.core.Model( modelRenderables, modelTransformMatrix, null, model.name );
                        for ( let currIdx : number = 0; currIdx < modelRenderables.length; currIdx++ )
                            this.exportableScenes.renderables.push ( modelRenderables[ currIdx ] );

                        this.exportableScenes.models.push ( coreModel );  
                    }

                    /* Experimental WexBIM loading. */
                    this.loadWexBim( this.findEffectByName( 'standardFlatShading' ) , this.exportableScenes );

                    // scenes                              = this.exportableScenes;
                    return this.exportableScenes;
                }
                update () {

                }
                findEffectByName ( name : string )
                {
                    let eff : renderPro.graphics.core.Effect    = null;
                    for ( let currEffIdx : number = 0; currEffIdx < this.exportableScenes.effects.length; currEffIdx++ )
                        if ( name === this.exportableScenes.effects[ currEffIdx ].name )
                        {
                            eff                     = this.exportableScenes.effects[ currEffIdx ];
                            break;
                        }

                    return eff;
                }
                findEffectById ( id : number )
                {
                    let eff : renderPro.graphics.core.Effect    = null;
                    for ( let currEffIdx : number = 0; currEffIdx < this.exportableScenes.effects.length; currEffIdx++ )
                        if ( id === this.exportableScenes.effects[ currEffIdx ].id )
                        {
                            eff                     = this.exportableScenes.effects[ currEffIdx ];
                            break;
                        }

                    return eff;
                }
                findTextureByName ( name : string )
                {
                    let tex : renderPro.graphics.core.Texture   = null;
                    for ( let currTexIdx : number = 0; currTexIdx < this.exportableScenes.textures.length; currTexIdx++ )
                        if ( name === this.exportableScenes.textures[ currTexIdx ].name )
                        {
                            tex                     = this.exportableScenes.textures[ currTexIdx ];
                            break;
                        }

                    return tex;
                }
                findTextureById ( id : number )
                {
                    let tex : renderPro.graphics.core.Texture   = null;
                    for ( let currTexIdx : number = 0; currTexIdx < this.exportableScenes.textures.length; currTexIdx++ )
                        if ( id === this.exportableScenes.textures[ currTexIdx ].textureID )
                        {
                            tex                     = this.exportableScenes.textures[ currTexIdx ];
                            break;
                        }

                    return tex;
                }
                findMaterialByName ( name : string )
                {
                    let mtl : renderPro.graphics.core.Material  = null;
                    for ( let currMtlIdx : number = 0; currMtlIdx < this.exportableScenes.materials.length; currMtlIdx++ )
                        if ( name === this.exportableScenes.materials[ currMtlIdx ].name )
                        {
                            mtl                     = this.exportableScenes.materials[ currMtlIdx ];
                            break;
                        }

                    return mtl;
                }
                findMaterialById ( id : number )
                {
                    let mtl : renderPro.graphics.core.Material  = null;
                    for ( let currMtlIdx : number = 0; currMtlIdx < this.exportableScenes.materials.length; currMtlIdx++ )
                        if ( id === this.exportableScenes.materials[ currMtlIdx ].materialID )
                        {
                            mtl                     = this.exportableScenes.materials[ currMtlIdx ];
                            break;
                        }

                    return mtl;
                }
                findMeshById ( id : number)
                {
                    let mesh : renderPro.graphics.core.Mesh     = null;
                    for ( let currMeshIdx : number = 0; currMeshIdx < this.exportableScenes.meshes.length; currMeshIdx++ )
                        if ( id === this.exportableScenes.meshes[ currMeshIdx ].meshID )
                        {
                            mesh                    = this.exportableScenes.meshes[ currMeshIdx ];
                            break;
                        }

                        return mesh;
                }
                private processFaceGroup ( model : any, renderables : Array<renderPro.graphics.gl.Renderable>, faceGroup : any)
                {
                    let renderablesInFaceGroup : Array<renderPro.graphics.gl.Renderable> = [ ];
                    for ( let faceIdx : number = 0; faceIdx < faceGroup.value.length; faceIdx++ )
                    {
                        let face                            = faceGroup.value[ faceIdx ];
                        let actualVertexArray : Array<renderPro.graphics.core.Vertex> = [ ];
                        let indexArray : Array<number>      = [ ];
                        for ( let vertexIdx : number        = 0; vertexIdx < face.vertices.length; vertexIdx++ )
                        {
                            let exportableVertex : any      = face.vertices[ vertexIdx ];
                            let vPosArray : Float32Array    = new Float32Array( exportableVertex.position );
                            let vUvArray : Float32Array     = new Float32Array( exportableVertex.textureCoordinates );
                            let vNormArray : Int16Array     = new Int16Array( exportableVertex.normal );
                            let coreVertex : renderPro.graphics.core.Vertex = new renderPro.graphics.core.Vertex( vPosArray, vUvArray, vNormArray );
                            actualVertexArray.push( coreVertex );
                            indexArray.push ( vertexIdx );
                        }

                        let mesh : renderPro.graphics.core.Mesh             = new renderPro.graphics.core.Mesh( actualVertexArray, actualVertexArray.length, indexArray, indexArray.length );
                        let usedMaterial : any                              = model.faces[ faceIdx ].material;
                        let renderable : renderPro.graphics.gl.Renderable   = new renderPro.graphics.gl.Renderable 
                        (
                            mesh,
                            usedMaterial.textures.getByKey("diffuseMap").texture,
                            usedMaterial,
                            renderPro.graphics.core.State.NORMAL,
                            this.findEffectByName( 'standardFlatShading' ) 
                        );
                        renderablesInFaceGroup.push( renderable );
                    }

                    renderables.push( this.combineRenderables( renderablesInFaceGroup ) );
                }
                /* NOTE(Martin): Renderables combined using this method must use the same material */
                private combineRenderables ( renderables : Array<renderPro.graphics.gl.Renderable>) 
                {
                    let combinedVertices : Array<renderPro.graphics.core.Vertex>    = [ ];
                    let combinedIndices : Array<number>                             = [ ];

                    for ( let renderIdx = 0; renderIdx < renderables.length; renderIdx++ )
                    {
                        let currRenderable : renderPro.graphics.gl.Renderable   = renderables[renderIdx];
                        let currMesh : renderPro.graphics.core.Mesh             = currRenderable.mesh;
                        let currAmountVertices : number                         = combinedVertices.length;
                        
                        for ( let vertexIdx : number = 0; vertexIdx < currMesh.vertices.length; vertexIdx++ ) 
                        {
                            combinedVertices.push( currMesh.vertices[vertexIdx] )
                        }

                        for ( let indexIdx : number = 0; indexIdx < currMesh.indices.length; indexIdx++ ) 
                        {
                            combinedIndices.push( currMesh.indices[indexIdx] + currAmountVertices);
                        }
                    }

                    let combinedMesh : renderPro.graphics.core.Mesh     = new renderPro.graphics.core.Mesh( 
                        combinedVertices, 
                        combinedVertices.length, 
                        combinedIndices, 
                        combinedIndices.length
                    );

                    let renderable : renderPro.graphics.gl.Renderable   = new renderPro.graphics.gl.Renderable(
                        combinedMesh,
                        renderables[0].texture,
                        renderables[0].material,
                        renderPro.graphics.core.State.NORMAL,
                        this.findEffectByName( 'standardFlatShading' ) 
                    );
                    return renderable
                }
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
                /*                Test functions. Do not call.             */
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
                private initTextureFromArray() : renderPro.graphics.core.Texture
                {
                    let rawData = [
                        1.0, 0.0, 0.0, 1.0,
                        0.0, 0.0, 0.0, 1.0,
                        0.0, 0.0, 0.0, 1.0
                    ];
                    let data : Float32Array                         = new Float32Array(rawData);
                    var coreTex : renderPro.graphics.core.Texture   = new renderPro.graphics.core.Texture();
                    coreTex.load(data, CoreType.FLOAT32, 3, 1);
                    return coreTex;
                }
                private loadWexBim(effect, exportableScenes) 
                {
                    let newGeometry : xModelGeometry    = new xModelGeometry();
                    let blob : Blob                     = new Blob([newGeometry]);

                    let xModelGeometry_Loaded_OLD : ( shapes : Array<any>) => void = (shapes: Array<any>) => {

                        for (let currShapeIdx : number = 0; currShapeIdx < shapes.length; currShapeIdx++) {

                            var shape                                                   = shapes[currShapeIdx];
                            let vertexTable : Array<renderPro.graphics.core.Vertex>     = [];
                            let coreVertices  : Array<renderPro.graphics.core.Vertex>   = [];

                            for (let currVertStartIdx : number = 0; currVertStartIdx < shape.vertices.length; currVertStartIdx += 3) {
                                let positions : Float32Array                = new Float32Array([shape.vertices[currVertStartIdx], shape.vertices[currVertStartIdx + 2], shape.vertices[currVertStartIdx + 1]]);
                                let vertex : renderPro.graphics.core.Vertex = new renderPro.graphics.core.Vertex(positions);
                                vertexTable.push(vertex);
                            }
                            let triangleSkeletons : Array<Array<any>>   = [];
                            for (var currIndiceIdx : number = 0; currIndiceIdx < shape.indices.length; currIndiceIdx += 3) {
                                let indices : Array<number>             = [shape.indices[currIndiceIdx], shape.indices[currIndiceIdx + 1], shape.indices[currIndiceIdx + 2]];
                                triangleSkeletons.push(indices);
                            }
                            let triangles  : Array<Array<any>>          = [];
                            for (let currSkeletonIdx : number = 0; currSkeletonIdx < triangleSkeletons.length; currSkeletonIdx++) {
                                let currSkeleton : Array<number>        = triangleSkeletons[currSkeletonIdx];
                                let triangle : Array<any>               = [];
                                for (let vertexIdx : number = 0; vertexIdx < currSkeleton.length; vertexIdx++) {
                                    let vertexIndex : number    = currSkeleton[vertexIdx];
                                    let vertexData : any        = {
                                        position: vertexTable[vertexIndex].position,
                                        normal: []
                                    };
                                    triangle.push(vertexData);
                                }
                                triangles.push(triangle);
                            }
                            let normalIdx : number = 0;
                            for (let triangleIdx : number = 0; triangleIdx < triangles.length; triangleIdx++) {
                                let triangle : Array<any>       = triangles[triangleIdx];
                                for (let vertIdx : number = 0; vertIdx < triangles[triangleIdx].length; vertIdx++) {
                                    let vertex : any            = triangle[vertIdx];
                                    let normal : Array<any>     = [shape.normals[++normalIdx], shape.normals[++normalIdx]];
                                    vertex.normal               = new Uint16Array(normal);
                                    vertex.uv                   = new Float32Array([0.0, 0.0]);
                                    let coreVertex : renderPro.graphics.core.Vertex = new renderPro.graphics.core.Vertex(vertex.position, vertex.uv, vertex.normal);
                                    coreVertices.push(coreVertex);
                                }
                            }
                            let coreMesh : renderPro.graphics.core.Mesh         = new renderPro.graphics.core.Mesh(coreVertices, coreVertices[0].getSize(), shape.indices, 2);
                            let texData : Float32Array = new Float32Array([
                                1.0, 0.0, 0.0, 1.0,
                                0.0, 0.0, 0.0, 1.0,
                                0.0, 0.0, 0.0, 1.0
                            ]);
                            let coreTex : renderPro.graphics.core.Texture       = new renderPro.graphics.core.Texture();
                            coreTex.load(texData, CoreType.FLOAT32, 3, 1);
                            let material : renderPro.graphics.core.Material     = new renderPro.graphics.core.Material(
                                [1.0, 0.0, 0.0, 1.0], 
                                [0.0, 0.0, 0.0, 1.0], 
                                [0.0, 0.0, 0.0, 1.0], 
                                1.0);
                            let renderable : renderPro.graphics.gl.Renderable   = new renderPro.graphics.gl.Renderable(coreMesh, coreTex, material, renderPro.graphics.core.State.NORMAL, effect);
                            let modelTransformMatrix : Float32Array             = mat4.create();
                            mat4.identity(modelTransformMatrix);
                            let translation : Float32Array                      = new Float32Array([ 0, 0, 0 ]);
                            mat4.translate(modelTransformMatrix, modelTransformMatrix, translation);
                            let model : renderPro.graphics.core.Model           = new renderPro.graphics.core.Model([renderable], modelTransformMatrix, null, "WexBIM");
                            exportableScenes.models.push(model);
                            Application.Systems.eventSystem.fire("wexBimLoaded");
                        }
                    };

                    var xModelGeometry_Loaded_NEW : ( shapes : Array<any>) => void = (shapes) => {
                        var handle = new xModelHandle(renderPro.graphics.gl.context, this, true);
                        handle.stateStyle = new Uint8Array(15 * 15 * 4);
                        var rawTexData = [
                            1.0, 0.0, 0.0, 1.0,
                            0.0, 0.0, 0.0, 1.0,
                            0.0, 0.0, 0.0, 1.0
                        ];
                        var data = new Float32Array(rawTexData);
                        var coreTex = new renderPro.graphics.core.Texture();
                        coreTex.load(data, CoreType.FLOAT32, 3, 1);
                        var material = new renderPro.graphics.core.Material([1.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0], 1.0);
                        var renderable = new renderPro.graphics.gl.WexBIMRenderable(handle, coreTex, material, renderPro.graphics.core.State.NORMAL, effect);
                        var modelTransformMatrix = mat4.create();
                        mat4.identity(modelTransformMatrix);
                        var translation : Float32Array = new Float32Array([0, 0, 0]);
                        mat4.translate(modelTransformMatrix, modelTransformMatrix, translation);
                        var model = new renderPro.graphics.core.Model([renderable], modelTransformMatrix, null, "WexBIM");
                        exportableScenes.models.push(model);
                        Application.Systems.eventSystem.fire("wexBimLoaded");
                    };
                
                    var xModelGeometry_Loaded = xModelGeometry_Loaded_OLD;
                    newGeometry.onloaded = xModelGeometry_Loaded;
                    newGeometry.load("/assets/models/OneWall.wexbim");
                }
                
                    
            }
        }
    }
}
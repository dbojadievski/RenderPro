var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var systems;
        (function (systems) {
            var AssetManager = (function () {
                function AssetManager(assets, renderStats) {
                    this.assets = assets;
                    this.renderStats = renderStats;
                }
                AssetManager.prototype.init = function () {
                    this.exportableScenes =
                        {
                            textures: [],
                            materials: [],
                            meshes: [],
                            models: [],
                            renderables: [],
                            effects: []
                        };
                    var tempModels = [];
                    // this.initTextureFromArray ( );
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
                    for (var currTexIdx = 0; currTexIdx < this.assets.textures.length; currTexIdx++) {
                        var tex = this.assets.textures[currTexIdx];
                        var coreTex = new renderPro.graphics.core.Texture(tex.content);
                        coreTex.textureID = (parseInt(tex.id) - 1000);
                        coreTex.name = tex.content.substring(tex.content.lastIndexOf('\\') + 1);
                        this.exportableScenes.textures.push(coreTex);
                    }
                    for (var currEffIdx = 0; currEffIdx < this.assets.effects.length; currEffIdx++) {
                        var effectObject = this.assets.effects[currEffIdx];
                        var vertexShaderObject = void 0, fragmentShaderObject = void 0;
                        for (var shaderScriptIdx = 0; shaderScriptIdx < this.assets.shaders.length; shaderScriptIdx++) {
                            if (this.assets.shaders[shaderScriptIdx].id === effectObject.vertexShaderId) {
                                vertexShaderObject = this.assets.shaders[shaderScriptIdx];
                            }
                            if (this.assets.shaders[shaderScriptIdx].id === effectObject.fragmentShaderId) {
                                fragmentShaderObject = this.assets.shaders[shaderScriptIdx];
                            }
                        }
                        if (!vertexShaderObject || !fragmentShaderObject)
                            return null;
                        var coreEffect = new renderPro.graphics.core.Effect(effectObject.name);
                        coreEffect.load(vertexShaderObject, fragmentShaderObject);
                        this.exportableScenes.effects.push(coreEffect);
                    }
                    for (var currMtlIdx = 0; currMtlIdx < this.assets.materials.length; currMtlIdx++) 
                    /* TODO(Dino): every material file can contain multiple materials, but this isn't recognized in this function.  */
                    {
                        var mtl = this.assets.materials[currMtlIdx];
                        /* NOTE(Martin): renderPro is cast to 'any' to prevent a 'Property does not exist' compiler error
                        * caused by renderPro.importers being standard javascript.
                        * TODO: find a better solution to supress the error.
                        */
                        var innerMtl = renderPro.importers.loadMaterialFromMaterialFile(mtl.content);
                        Application.Debug.assert(innerMtl.length === 1, "INVALID CONTENT: Export tool supports only one material per material file.");
                        innerMtl = innerMtl[0];
                        var ambient = innerMtl.ambient;
                        var diffuse = innerMtl.diffuse;
                        var specular = innerMtl.specular;
                        var coreMtl = new renderPro.graphics.core.Material(ambient, diffuse, specular, innerMtl.shininess);
                        if (innerMtl.diffuseMap !== null) {
                            var mapCoreTex = this.findTextureByName(innerMtl.diffuseMap.name);
                            Application.Debug.assert(mapCoreTex !== null, "INVALID CONTENT: Texture map missing.");
                            var diffuseMap = {
                                texture: mapCoreTex,
                                base: innerMtl.diffuseMap.base,
                                gain: innerMtl.diffuseMap.gain,
                                blendU: innerMtl.diffuseMap.blendU,
                                blendV: innerMtl.diffuseMap.blendV,
                                originOffset: innerMtl.diffuseMap.originOffset,
                                scale: innerMtl.diffuseMap.scale,
                                turbulence: innerMtl.diffuseMap.turbulence,
                                clamp: innerMtl.diffuseMap.clamp
                            };
                            if (innerMtl.diffuseMap.textureResolution !== undefined && innerMtl.diffuseMap.textureResolution !== null)
                                diffuseMap["resolution"] = innerMtl.diffuseMap.textureResolution;
                            coreMtl.textures.add("diffuseMap", diffuseMap);
                        }
                        if (innerMtl.ambientMap !== null) {
                            var mapCoreTex = this.findTextureByName(innerMtl.ambientMap.name);
                            Application.Debug.assert(mapCoreTex !== null, "INVALID CONTENT: Texture map missing.");
                            var ambientMap = {
                                texture: mapCoreTex,
                                base: innerMtl.ambientMap.base,
                                gain: innerMtl.ambientMap.gain,
                                blendU: innerMtl.ambientMap.blendU,
                                blendV: innerMtl.ambientMap.blendV,
                                originOffset: innerMtl.ambientMap.originOffset,
                                scale: innerMtl.ambientMap.scale,
                                turbulence: innerMtl.ambientMap.turbulence,
                                clamp: innerMtl.ambientMap.clamp
                            };
                            if (innerMtl.ambientMap.textureResolution !== undefined && innerMtl.ambientMap.textureResolution !== null)
                                ambientMap["resolution"] = innerMtl.ambientMap.textureResolution;
                            coreMtl.textures.add("ambientMap", ambientMap);
                        }
                        if (innerMtl.specularMap !== null) {
                            var mapCoreTex = this.findTextureByName(innerMtl.specularMap.name);
                            Application.Debug.assert(mapCoreTex !== null, "INVALID CONTENT: Texture map missing.");
                            var specularMap = {
                                texture: mapCoreTex,
                                base: innerMtl.specularMap.base,
                                gain: innerMtl.specularMap.gain,
                                blendU: innerMtl.specularMap.blendU,
                                blendV: innerMtl.specularMap.blendV,
                                originOffset: innerMtl.specularMap.originOffset,
                                scale: innerMtl.specularMap.scale,
                                turbulence: innerMtl.specularMap.turbulence,
                                clamp: innerMtl.specularMap.clamp
                            };
                            if (innerMtl.specularMap.textureResolution !== undefined && innerMtl.specularMap.textureResolution !== null)
                                specularMap["resolution"] = innerMtl.specularMap.textureResolution;
                            coreMtl.textures.add("specularMap", specularMap);
                        }
                        if (innerMtl.alphaMap !== null) {
                            var mapCoreTex = this.findTextureByName(innerMtl.alphaMap.name);
                            Application.Debug.assert(mapCoreTex !== null, "INVALID CONTENT: Texture map missing.");
                            var alphaMap = {
                                texture: mapCoreTex,
                                base: innerMtl.alphaMap.base,
                                gain: innerMtl.alphaMap.gain,
                                blendU: innerMtl.alphaMap.blendU,
                                blendV: innerMtl.alphaMap.blendV,
                                clamp: innerMtl.alphaMap.clamp,
                                originOffset: innerMtl.alphaMap.originOffset,
                                scale: innerMtl.alphaMap.scale,
                                turbulence: innerMtl.alphaMap.turbulence
                            };
                            if (innerMtl.alphaMap.textureResolution !== undefined && innerMtl.alphaMap.textureResolution !== null)
                                alphaMap["resolution"] = innerMtl.alphaMap.textureResolution;
                            coreMtl.textures.add("alphaMap", alphaMap);
                        }
                        coreMtl.materialID = (parseInt(mtl.id) - 2000);
                        coreMtl.name = innerMtl.name;
                        this.exportableScenes.materials.push(coreMtl);
                    }
                    for (var currModelIdx = 0; currModelIdx < this.assets.models.length; currModelIdx++) {
                        var str = this.assets.models[currModelIdx].content;
                        /* NOTE(Martin): renderPro is cast to 'any' to prevent a 'Property does not exist' compiler error
                        * caused by renderPro.importers being standard javascript.
                        * TODO: find a better solution to supress the error.
                        */
                        var model = renderPro.importers.loadGeometryFromObjectFile(str);
                        Application.Debug.assert(model !== null, "Model parse from OBJ failed.");
                        for (var modelIdx = 0; modelIdx < model.length; modelIdx++) {
                            var subModel = model[modelIdx];
                            for (var faceIdx = 0; faceIdx < subModel.faces.length; faceIdx++) {
                                if (subModel.faces[faceIdx] !== null) 
                                /* By .obj specification, the default material for a face is a matte white material.  */
                                {
                                    var mtl = this.findMaterialByName(subModel.faces[faceIdx].material);
                                    /* NOTE(Martin): renderPro is cast to 'any' to prevent a 'Property does not exist' compiler error
                                    * caused by renderPro.assets being standard javascript.
                                    * TODO: find a better solution to supress the error.
                                    */
                                    subModel.faces[faceIdx].material = mtl !== null ? mtl : renderPro.assets.materials.materialWhite;
                                    subModel.facesByMaterial;
                                }
                            }
                            tempModels.push(subModel);
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
                    for (var currModelIdx = 0; currModelIdx < tempModels.length; currModelIdx++) {
                        var model = tempModels[currModelIdx];
                        var materialMap = new Dictionary();
                        for (var faceIdx = 0; faceIdx < model.faces.length; faceIdx++) {
                            var faceMaterial = model.faces[faceIdx].material;
                            if (!materialMap.hasKey(faceMaterial.materialID))
                                materialMap.push(new KeyValuePair(faceMaterial.materialID, []));
                            var facesByMaterial = materialMap.getByKey(faceMaterial.materialID);
                            facesByMaterial.push(model.faces[faceIdx]);
                        }
                        var vertexArray = [];
                        /* NOTE(Dino): Separate by model, and not just by material ID. */
                        var modelRenderables = [];
                        materialMap.iterate(this.processFaceGroup.bind(this, model, modelRenderables));
                        var modelTransformMatrix = mat4.create();
                        mat4.identity(modelTransformMatrix);
                        var translation = new Float32Array([0, 0, -30 + 9000]);
                        mat4.translate(modelTransformMatrix, modelTransformMatrix, translation);
                        var rotation = generateRotation();
                        mat4.rotateX(modelTransformMatrix, modelTransformMatrix, rotation[0]);
                        mat4.rotateY(modelTransformMatrix, modelTransformMatrix, rotation[1]);
                        mat4.rotateZ(modelTransformMatrix, modelTransformMatrix, rotation[2]);
                        var coreModel = new renderPro.graphics.core.Model(modelRenderables, modelTransformMatrix, null, model.name);
                        for (var currIdx = 0; currIdx < modelRenderables.length; currIdx++)
                            this.exportableScenes.renderables.push(modelRenderables[currIdx]);
                        this.exportableScenes.models.push(coreModel);
                        Application.Systems.eventSystem.on('wexBimLoaded', function () {
                            Application.Systems.eventSystem.fire('resourcesLoaded');
                        });
                    }
                    /* Experimental WexBIM loading. */
                    this.loadWexBim(this.findEffectByName('wexbimFlatShading'), this.exportableScenes);
                    // scenes                              = this.exportableScenes;
                    return this.exportableScenes;
                };
                AssetManager.prototype.update = function () {
                };
                AssetManager.prototype.findEffectByName = function (name) {
                    var eff = null;
                    for (var currEffIdx = 0; currEffIdx < this.exportableScenes.effects.length; currEffIdx++)
                        if (name === this.exportableScenes.effects[currEffIdx].name) {
                            eff = this.exportableScenes.effects[currEffIdx];
                            break;
                        }
                    return eff;
                };
                AssetManager.prototype.findEffectById = function (id) {
                    var eff = null;
                    for (var currEffIdx = 0; currEffIdx < this.exportableScenes.effects.length; currEffIdx++)
                        if (id === this.exportableScenes.effects[currEffIdx].id) {
                            eff = this.exportableScenes.effects[currEffIdx];
                            break;
                        }
                    return eff;
                };
                AssetManager.prototype.findTextureByName = function (name) {
                    var tex = null;
                    for (var currTexIdx = 0; currTexIdx < this.exportableScenes.textures.length; currTexIdx++)
                        if (name === this.exportableScenes.textures[currTexIdx].name) {
                            tex = this.exportableScenes.textures[currTexIdx];
                            break;
                        }
                    return tex;
                };
                AssetManager.prototype.findTextureById = function (id) {
                    var tex = null;
                    for (var currTexIdx = 0; currTexIdx < this.exportableScenes.textures.length; currTexIdx++)
                        if (id === this.exportableScenes.textures[currTexIdx].textureID) {
                            tex = this.exportableScenes.textures[currTexIdx];
                            break;
                        }
                    return tex;
                };
                AssetManager.prototype.findMaterialByName = function (name) {
                    var mtl = null;
                    for (var currMtlIdx = 0; currMtlIdx < this.exportableScenes.materials.length; currMtlIdx++)
                        if (name === this.exportableScenes.materials[currMtlIdx].name) {
                            mtl = this.exportableScenes.materials[currMtlIdx];
                            break;
                        }
                    return mtl;
                };
                AssetManager.prototype.findMaterialById = function (id) {
                    var mtl = null;
                    for (var currMtlIdx = 0; currMtlIdx < this.exportableScenes.materials.length; currMtlIdx++)
                        if (id === this.exportableScenes.materials[currMtlIdx].materialID) {
                            mtl = this.exportableScenes.materials[currMtlIdx];
                            break;
                        }
                    return mtl;
                };
                AssetManager.prototype.findMeshById = function (id) {
                    var mesh = null;
                    for (var currMeshIdx = 0; currMeshIdx < this.exportableScenes.meshes.length; currMeshIdx++)
                        if (id === this.exportableScenes.meshes[currMeshIdx].meshID) {
                            mesh = this.exportableScenes.meshes[currMeshIdx];
                            break;
                        }
                    return mesh;
                };
                AssetManager.prototype.processFaceGroup = function (model, renderables, faceGroup) {
                    var renderablesInFaceGroup = [];
                    for (var faceIdx = 0; faceIdx < faceGroup.value.length; faceIdx++) {
                        var face = faceGroup.value[faceIdx];
                        var actualVertexArray = [];
                        var indexArray = [];
                        for (var vertexIdx = 0; vertexIdx < face.vertices.length; vertexIdx++) {
                            var exportableVertex = face.vertices[vertexIdx];
                            var vPosArray = new Float32Array(exportableVertex.position);
                            var vUvArray = new Float32Array(exportableVertex.textureCoordinates);
                            var vNormArray = new Int16Array(exportableVertex.normal);
                            var coreVertex = new renderPro.graphics.core.Vertex(vPosArray, vUvArray, vNormArray);
                            actualVertexArray.push(coreVertex);
                            indexArray.push(vertexIdx);
                        }
                        var mesh = new renderPro.graphics.core.Mesh(actualVertexArray, actualVertexArray.length, indexArray, indexArray.length);
                        var usedMaterial = model.faces[faceIdx].material;
                        var renderable = new renderPro.graphics.gl.Renderable(mesh, usedMaterial.textures.getByKey("diffuseMap").texture, usedMaterial, renderPro.graphics.core.State.NORMAL, this.findEffectByName('standardFlatShading'));
                        renderablesInFaceGroup.push(renderable);
                    }
                    renderables.push(this.combineRenderables(renderablesInFaceGroup));
                };
                /* NOTE(Martin): Renderables combined using this method must use the same material */
                AssetManager.prototype.combineRenderables = function (renderables) {
                    var combinedVertices = [];
                    var combinedIndices = [];
                    for (var renderIdx = 0; renderIdx < renderables.length; renderIdx++) {
                        var currRenderable = renderables[renderIdx];
                        var currMesh = currRenderable.mesh;
                        var currAmountVertices = combinedVertices.length;
                        for (var vertexIdx = 0; vertexIdx < currMesh.vertices.length; vertexIdx++) {
                            combinedVertices.push(currMesh.vertices[vertexIdx]);
                        }
                        for (var indexIdx = 0; indexIdx < currMesh.indices.length; indexIdx++) {
                            combinedIndices.push(currMesh.indices[indexIdx] + currAmountVertices);
                        }
                    }
                    var combinedMesh = new renderPro.graphics.core.Mesh(combinedVertices, combinedVertices.length, combinedIndices, combinedIndices.length);
                    var renderable = new renderPro.graphics.gl.Renderable(combinedMesh, renderables[0].texture, renderables[0].material, renderPro.graphics.core.State.NORMAL, this.findEffectByName('standardFlatShading'));
                    return renderable;
                };
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
                /*                Test functions. Do not call.             */
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
                AssetManager.prototype.initTextureFromArray = function () {
                    var rawData = [
                        1.0, 0.0, 0.0, 1.0,
                        0.0, 0.0, 0.0, 1.0,
                        0.0, 0.0, 0.0, 1.0
                    ];
                    var data = new Float32Array(rawData);
                    var coreTex = new renderPro.graphics.core.Texture();
                    coreTex.load(data, CoreType.FLOAT32, 4, 3);
                    return coreTex;
                };
                AssetManager.prototype.loadWexBim = function (effect, exportableScenes) {
                    var _this = this;
                    var newGeometry = new xModelGeometry();
                    var blob = new Blob([newGeometry]);
                    var xModelGeometry_Loaded_OLD = function (shapes) {
                        for (var currShapeIdx = 0; currShapeIdx < shapes.length; currShapeIdx++) {
                            var shape = shapes[currShapeIdx];
                            var vertexTable = [];
                            var coreVertices = [];
                            for (var currVertStartIdx = 0; currVertStartIdx < shape.vertices.length; currVertStartIdx += 3) {
                                var positions = new Float32Array([shape.vertices[currVertStartIdx], shape.vertices[currVertStartIdx + 2], shape.vertices[currVertStartIdx + 1]]);
                                var vertex = new renderPro.graphics.core.Vertex(positions);
                                vertexTable.push(vertex);
                            }
                            var triangleSkeletons = [];
                            for (var currIndiceIdx = 0; currIndiceIdx < shape.indices.length; currIndiceIdx += 3) {
                                var indices = [shape.indices[currIndiceIdx], shape.indices[currIndiceIdx + 1], shape.indices[currIndiceIdx + 2]];
                                triangleSkeletons.push(indices);
                            }
                            var triangles = [];
                            for (var currSkeletonIdx = 0; currSkeletonIdx < triangleSkeletons.length; currSkeletonIdx++) {
                                var currSkeleton = triangleSkeletons[currSkeletonIdx];
                                var triangle = [];
                                for (var vertexIdx = 0; vertexIdx < currSkeleton.length; vertexIdx++) {
                                    var vertexIndex = currSkeleton[vertexIdx];
                                    var vertexData = {
                                        position: vertexTable[vertexIndex].position,
                                        normal: []
                                    };
                                    triangle.push(vertexData);
                                }
                                triangles.push(triangle);
                            }
                            var normalIdx = 0;
                            for (var triangleIdx = 0; triangleIdx < triangles.length; triangleIdx++) {
                                var triangle = triangles[triangleIdx];
                                for (var vertIdx = 0; vertIdx < triangles[triangleIdx].length; vertIdx++) {
                                    var vertex = triangle[vertIdx];
                                    var normal = [shape.normals[++normalIdx], shape.normals[++normalIdx]];
                                    vertex.normal = new Uint16Array(normal);
                                    vertex.uv = new Float32Array([0.0, 0.0]);
                                    var coreVertex = new renderPro.graphics.core.Vertex(vertex.position, vertex.uv, vertex.normal);
                                    coreVertices.push(coreVertex);
                                }
                            }
                            var coreMesh = new renderPro.graphics.core.Mesh(coreVertices, coreVertices[0].getSize(), shape.indices, 2);
                            var texData = new Float32Array([
                                1.0, 0.0, 0.0, 1.0,
                                0.0, 0.0, 0.0, 1.0,
                                0.0, 0.0, 0.0, 1.0
                            ]);
                            var coreTex = new renderPro.graphics.core.Texture();
                            coreTex.load(texData, CoreType.FLOAT32, 3, 1);
                            var material = new renderPro.graphics.core.Material([1.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0], 1.0);
                            var renderable = new renderPro.graphics.gl.Renderable(coreMesh, coreTex, material, renderPro.graphics.core.State.NORMAL, effect);
                            var modelTransformMatrix = mat4.create();
                            mat4.identity(modelTransformMatrix);
                            var translation = new Float32Array([0, 0, 0]);
                            mat4.translate(modelTransformMatrix, modelTransformMatrix, translation);
                            var model = new renderPro.graphics.core.Model([renderable], modelTransformMatrix, null, "WexBIM");
                            exportableScenes.models.push(model);
                            Application.Systems.eventSystem.fire("wexBimLoaded");
                        }
                    };
                    var xModelGeometry_Loaded_NEW = function (shapes) {
                        var handle = new xModelHandle(renderPro.graphics.gl.context, newGeometry, true, _this.renderStats);
                        handle.stateStyle = new Uint8Array(15 * 15 * 4);
                        var texData = new Float32Array([
                            1.0, 0.0, 0.0, 1.0,
                            0.0, 0.0, 0.0, 1.0,
                            0.0, 0.0, 0.0, 1.0
                        ]);
                        var coreTex = new renderPro.graphics.core.Texture();
                        coreTex.load(texData, CoreType.FLOAT32, 4, 3);
                        var material = new renderPro.graphics.core.Material([1.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0], 1.0);
                        var renderable = new renderPro.graphics.gl.WexBIMRenderable(handle, coreTex, material, renderPro.graphics.core.State.NORMAL, effect);
                        var modelTransformMatrix = mat4.create();
                        mat4.identity(modelTransformMatrix);
                        var translation = new Float32Array([0, 0, 0]);
                        mat4.translate(modelTransformMatrix, modelTransformMatrix, translation);
                        var model = new renderPro.graphics.core.Model([renderable], modelTransformMatrix, null, "WexBIM");
                        exportableScenes.models.push(model);
                        Application.Systems.eventSystem.fire("wexBimLoaded");
                    };
                    var xModelGeometry_Loaded = xModelGeometry_Loaded_NEW;
                    newGeometry.onloaded = xModelGeometry_Loaded;
                    newGeometry.load("assets/models/OneWall.wexbim");
                };
                return AssetManager;
            }());
            systems.AssetManager = AssetManager;
        })(systems = core.systems || (core.systems = {}));
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

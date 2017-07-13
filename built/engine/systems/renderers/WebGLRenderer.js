var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var systems;
        (function (systems) {
            var renderers;
            (function (renderers) {
                var WebGLRenderer = (function () {
                    function WebGLRenderer(assetManager, eventSystem) {
                        this.m_renderSet = new renderPro.graphics.rendering.SortedRenderSet();
                        this.FIELD_OF_VIEW = 45.0;
                        this.DISTANCE_NEAR = 0.1;
                        this.DISTANCE_FAR = 20000;
                        this.m_eventSystem = eventSystem;
                        this.m_assetManager = assetManager;
                        var canvas = document.getElementById("canvas");
                        this.m_lblPerformance = document.getElementById('lblPerformance');
                        this.m_glContext = canvas.getContext("experimental-webgl");
                        this.m_viewportWidth = canvas.width;
                        this.m_viewportHeight = canvas.height;
                        renderPro.graphics.gl.context = this.m_glContext;
                    }
                    WebGLRenderer.prototype.initScene = function () {
                        this.m_origin = new Float32Array([0.0, 0.0, 0.0]);
                        this.m_scene = new renderPro.data.scene.Scene();
                        this.m_pMatrix = mat4.create();
                        mat4.perspective(this.m_pMatrix, this.FIELD_OF_VIEW, this.m_viewportWidth / this.m_viewportHeight, this.DISTANCE_NEAR, this.DISTANCE_FAR);
                        var cameraPosition = new Float32Array([this.m_origin[0], this.m_origin[1], this.m_origin[2] + 9000]); /* NOTE(Dino): The camera position is 9000 units z-wise because that's how our test models are set up. */
                        var cameralookAtDirection = new Float32Array(WorldDirection.FORWARD);
                        var camera = new renderPro.graphics.scene.Camera(cameraPosition, cameralookAtDirection);
                        this.m_scene.addCamera(camera);
                        this.m_viewMatrix = camera.getViewMatrix(new Float32Array(WorldDirection.UP));
                    };
                    WebGLRenderer.prototype.hasRenderable = function (renderableID, renderables) {
                        var hasRenderable = false;
                        for (var renderableIdx = 0; renderableIdx < renderables.length; renderableIdx++) {
                            var renderable = renderables[renderableIdx];
                            if (renderable.renderableID === renderableID) {
                                hasRenderable = true;
                                break;
                            }
                        }
                        return hasRenderable;
                    };
                    /* Sort renderables by the following parameters:
                    *  - shaders
                    *  - diffuse textures
                    * Output is preserved in @param sortedRenderables.
                    */
                    WebGLRenderer.prototype.renderableSorterExperimental = function (renderables, sortedRenderables) {
                        for (var currRenderableIdx = 0; currRenderableIdx < renderables.length; currRenderableIdx++) {
                            var currRenderable = renderables[currRenderableIdx].renderable;
                            var currRenderableKeyEffect = (currRenderable.effect);
                            var currRenderableKeyTexture = (currRenderable.texture);
                            var effectDictionary = sortedRenderables.getByKey(currRenderableKeyEffect);
                            if (effectDictionary == null) {
                                var kvp = new KeyValuePair(currRenderableKeyEffect, new Dictionary());
                                effectDictionary = kvp.value;
                                sortedRenderables.push(kvp);
                            }
                            var textureDictionary = effectDictionary.getByKey(currRenderableKeyTexture);
                            if (textureDictionary == null) {
                                var kvp = new KeyValuePair(currRenderableKeyTexture, []);
                                textureDictionary = kvp.value;
                                effectDictionary.push(kvp);
                            }
                            textureDictionary.push(renderables[currRenderableIdx]);
                        }
                    };
                    WebGLRenderer.prototype.initBuffers = function (models, textures) {
                        var _this = this;
                        var sortedRenderSet = new renderPro.graphics.rendering.SortedRenderSet();
                        var unsortedRenderSet = new renderPro.graphics.rendering.RenderSet();
                        /* Note(Dino):
                         * Here, we get prepared to start rendering.
                         *
                         * The first step that need be done is loading all relevant data to the graphics card.
                         * We need to be careful not to load the same data multiple times, however.
                         * Otherwise, we'd just be wasting VRAM.
                         */
                        var bufferedRenderables = new Array();
                        var processModel = function (currModel, renderSet, parentNode) {
                            for (var currChildIndex = 0; currChildIndex < currModel.children.length; currChildIndex++)
                                processModel.call(_this, currModel[currChildIndex], currModel[currChildIndex].renderables, parentNode);
                            for (var currRenderableIdx = 0; currRenderableIdx < currModel.renderables.length; currRenderableIdx++) {
                                var currRenderable = currModel.renderables[currRenderableIdx];
                                if (!_this.hasRenderable(currRenderable.renderableID, bufferedRenderables)) {
                                    currRenderable.bufferData(_this.m_glContext);
                                    bufferedRenderables.push(currRenderable);
                                }
                                /*
                                * Note(Dino):
                                * We need to separate renderable objects into transparent and opaque.
                                */
                                var sceneNode = new renderPro.data.scene.SceneNode(null);
                                sceneNode.transform = currModel.transform;
                                var renderableInstance = new renderPro.graphics.rendering.RenderableInstance(currRenderable, sceneNode);
                                parentNode.addChild(sceneNode);
                                if (currRenderable.state === renderPro.graphics.core.State.TRANSPARENT)
                                    renderSet.transparent.push(renderableInstance);
                                else
                                    renderSet.opaque.push(renderableInstance);
                            }
                        };
                        for (var currModelIdx = 0; currModelIdx < models.length; currModelIdx++)
                            processModel.call(this, models[currModelIdx], unsortedRenderSet, this.m_scene.nodes);
                        /* Converting the renderables from model to renderable instances */
                        var renderableInstances = [];
                        for (var renderableIdx = 0; renderableIdx < this.m_assetManager.exportableScenes.renderables.length; renderableIdx++) {
                            this.m_assetManager.exportableScenes.renderables[renderableIdx].bufferData(this.m_glContext);
                            var sceneNode = new renderPro.data.scene.SceneNode(null);
                            var renderableInstance = new renderPro.graphics.rendering.RenderableInstance(this.m_assetManager.exportableScenes.renderables[renderableIdx], sceneNode);
                            renderableInstances.push(renderableInstance);
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
                        this.m_scene.nodes.updateAll();
                        // Sort and load the renderables into the renderer.
                        this.renderableSorterExperimental(unsortedRenderSet.opaque, sortedRenderSet.opaque);
                        this.renderableSorterExperimental(unsortedRenderSet.transparent, sortedRenderSet.transparent);
                        return sortedRenderSet;
                    };
                    WebGLRenderer.prototype.drawScene = function (renderSet) {
                        var gl = this.m_glContext;
                        this.m_timer = Date.now();
                        this.m_drawCalls = 0;
                        this.m_programSwitches = 0;
                        this.m_textureSwitches = 0;
                        gl.viewport(0, 0, this.m_viewportWidth, this.m_viewportHeight);
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
                        for (var currFxIdx_1 = 0; currFxIdx_1 < renderSet.opaque.content.length; currFxIdx_1++) 
                        /* Opaque objects are rendered in this first pass. */
                        {
                            var byEffect = renderSet.opaque.content[currFxIdx_1];
                            if (byEffect.value.content.length > 0) {
                                /* Switch GPGPU program state. */
                                var effect = byEffect.key;
                                effect.innerEffect.use(gl);
                                // currentEffect                           = effect;
                                this.m_programSwitches++;
                                for (var currTexIdx_1 = 0; currTexIdx_1 < byEffect.value.content.length; currTexIdx_1++) {
                                    var byTexture = byEffect.value.content[currTexIdx_1];
                                    if (byTexture.value.length > 0) {
                                        /* Switch GPGPU texture state. */
                                        gl.activeTexture(gl.TEXTURE0);
                                        gl.bindTexture(gl.TEXTURE_2D, byTexture.key.getTexPointer());
                                        if (effect.innerEffect.uniforms["uSampler"])
                                            effect.innerEffect.uniforms["uSampler"].updateValue(0);
                                        this.m_textureSwitches++;
                                        for (var currRenderableIdx = 0; currRenderableIdx < byTexture.value.length; currRenderableIdx++) {
                                            var renderableInstance = byTexture.value[currRenderableIdx];
                                            var renderable = renderableInstance.renderable;
                                            this.setUniforms(renderable, renderableInstance.sceneNode.cachedTransform, effect);
                                            renderable.drawWithoutStateChanges(effect, gl);
                                            this.m_drawCalls;
                                        }
                                    }
                                }
                            }
                        }
                        for (var currFxIdx = 0; currFxIdx < renderSet.transparent.content.length; currFxIdx++) 
                        /* Transparent objects are rendered in this second pass. */
                        {
                            var byEffect = renderSet.transparent.content[currFxIdx];
                            if (byEffect.value.content.length > 0) {
                                /* Switch GPGPU program state. */
                                var effect = byEffect.key;
                                effect.innerEffect.use(gl);
                                //currentEffect                           = effect;
                                this.m_programSwitches++;
                                for (var currTexIdx = 0; currTexIdx < byEffect.value.content.length; currTexIdx++) {
                                    var byTexture = byEffect.value.content[currTexIdx];
                                    if (byTexture.value.length > 0) {
                                        /* Switch GPGPU texture state. */
                                        gl.activeTexture(gl.TEXTURE0);
                                        gl.bindTexture(gl.TEXTURE_2D, byTexture.key.getTexPointer());
                                        effect.innerEffect.uniforms["sampler"].updateValue(0);
                                        this.m_textureSwitches++;
                                        for (var currRenderableIdx_1 = 0; currRenderableIdx_1 < byTexture.value.length; currRenderableIdx_1++) {
                                            var renderableInstance = byTexture.value[currRenderableIdx_1];
                                            var renderable = renderableInstance.renderable;
                                            this.setUniforms(renderable, renderableInstance.sceneNode.cachedTransform, effect);
                                            renderable.drawWithoutStateChanges(effect, gl);
                                            this.m_drawCalls;
                                        }
                                    }
                                }
                            }
                        }
                        this.m_lastFrameTime = (Date.now() - this.m_timer);
                        this.m_lblPerformance.innerHTML = this.m_lastFrameTime + " ms, "
                            + this.m_programSwitches + " program switches, "
                            + this.m_textureSwitches + " texture switches, "
                            + this.m_drawCalls + " draw calls on "
                            + this.m_rendererName;
                    };
                    WebGLRenderer.prototype.setUniforms = function (renderable, transform, effect) {
                        var gl = this.m_glContext;
                        // Update uniforms for normalFlatShader 
                        if (effect.innerEffect.uniforms["uPMatrix"])
                            effect.innerEffect.uniforms["uPMatrix"].updateValue(this.m_pMatrix);
                        if (effect.innerEffect.uniforms["uVMatrix"])
                            effect.innerEffect.uniforms["uVMatrix"].updateValue(this.m_viewMatrix);
                        if (effect.innerEffect.uniforms["uMMatrix"])
                            effect.innerEffect.uniforms["uMMatrix"].updateValue(transform);
                        if (effect.innerEffect.uniforms["uMaterial.ambient"])
                            effect.innerEffect.uniforms["uMaterial.ambient"].updateValue(renderable.material.ambient);
                        if (effect.innerEffect.uniforms["uMaterial.diffuse"])
                            effect.innerEffect.uniforms["uMaterial.diffuse"].updateValue(renderable.material.diffuse);
                        if (effect.innerEffect.uniforms["uMaterial.specular"])
                            effect.innerEffect.uniforms["uMaterial.specular"].updateValue(renderable.material.specular);
                        if (effect.innerEffect.uniforms["uMaterial.shininess"])
                            effect.innerEffect.uniforms["uMaterial.shininess"].updateValue(renderable.material.shininess);
                        // Update uniforms for wexbimFlatShader
                        if (effect.innerEffect.uniforms["uTMatrix"]) {
                            var transformationMatrix = new Float32Array(16);
                            mat4.multiply(transformationMatrix, transform, this.m_viewMatrix);
                            mat4.multiply(transformationMatrix, transformationMatrix, this.m_pMatrix);
                            effect.innerEffect.uniforms["uTMatrix"].updateValue(transformationMatrix);
                        }
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, renderable.texture.getTexPointer());
                        if (effect.innerEffect.uniforms["uSampler"])
                            effect.innerEffect.uniforms["uSampler"].updateValue(0);
                    };
                    WebGLRenderer.prototype.init = function () {
                        var gl = this.m_glContext;
                        var floatTextures = gl.getExtension("OES_texture_float");
                        var floatTexturesLinearFilter = gl.getExtension("OES_texture_float_linear");
                        if (!floatTextures || !floatTexturesLinearFilter) {
                            alert('No floating point texture support. Terminating program.');
                            return;
                        }
                        if (Application.Debug.IS_DEBUGGING_ENABLED) {
                            try {
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
                                var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                                this.m_vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                                this.m_rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                            }
                            catch (e) {
                                throw e.message;
                            }
                        }
                        if (!gl)
                            alert("Could not initialise WebGL, sorry :-(");
                        this.initScene();
                        this.m_renderSet = this.initBuffers(this.m_assetManager.exportableScenes.models, this.m_assetManager.exportableScenes.models);
                        gl.clearColor(1.0, 0.0, 0.0, 1.0);
                        gl.enable(gl.DEPTH_TEST);
                    };
                    WebGLRenderer.prototype.update = function () {
                        this.drawScene(this.m_renderSet);
                    };
                    return WebGLRenderer;
                }());
                renderers.WebGLRenderer = WebGLRenderer;
            })(renderers = systems.renderers || (systems.renderers = {}));
        })(systems = core.systems || (core.systems = {}));
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

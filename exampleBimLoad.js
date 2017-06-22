xViewer.prototype.load = function (model) {
    Application.Debug.assert(!isUndefined(model), 'You have to speficy model to load.');
    Application.Debug.assert(isString(model) || (model instanceof Blob) || (model instanceof File), 'Model has to be specified either as a URL to wexBIM file or Blob object representing the wexBIM file.');
    var gl = this._gl;
    var viewer = this;
    viewer._fire('loading', {});
    var geometry = new xModelGeometry();
    geometry.onloaded = function () {
        var handle = new xModelHandle(viewer._gl, geometry, viewer._fpt != null);
        viewer._handles.push(handle);
        handle.stateStyle = viewer._stateStyles;
        viewer.numProducts += handle.getProductCount();
        handle.feedGPU();
        //get one meter size from model and set it to shader
        viewer.meter = handle._model.meter;
        gl.uniform1f(viewer._meterUniformPointer, viewer.meter);
        //set centre and default distance based on the most populated region in the model
        viewer.setCameraTarget();
        //set perspective camera near and far based on 1 meter dimension and size of the model
        var region = handle.region;
        var maxSize = Math.max(region.bbox[3], region.bbox[4], region.bbox[5]);
        viewer.perspectiveCamera.far = maxSize * 50;
        viewer.perspectiveCamera.near = viewer.meter / 10.0;
        //set orthogonalCamera boundaries so that it makes a sense
        viewer.orthogonalCamera.far = viewer.perspectiveCamera.far;
        viewer.orthogonalCamera.near = viewer.perspectiveCamera.near;
        var ratio = 1.8;
        viewer.orthogonalCamera.top = maxSize / ratio;
        viewer.orthogonalCamera.bottom = maxSize / ratio * -1;
        viewer.orthogonalCamera.left = maxSize / ratio * -1 * viewer._width / viewer._height;
        viewer.orthogonalCamera.right = maxSize / ratio * viewer._width / viewer._height;
        //set default view
        viewer.setCameraTarget();
        var dist = Math.sqrt(viewer._distance * viewer._distance / 3.0);
        viewer.setCameraPosition([region.centre[0] + dist * -1.0, region.centre[1] + dist * -1.0, region.centre[2] + dist]);
        /**
        * Occurs when geometry model is loaded into the viewer. This event has empty object.
        *
        * @event xViewer#loaded
        * @type {object}
        *
        */
        viewer._fire('loaded', {});
        viewer._geometryLoaded = true;
    };
    geometry.onerror = function (msg) {
        viewer._error(msg);
    };
    geometry.load(model);
};
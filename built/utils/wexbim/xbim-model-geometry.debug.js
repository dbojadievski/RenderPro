function xVertexLocationData() {
    this.vertexStartIndex = 0;
    this.vertexCount = 0;
}
function xModelGeometry() {
    // All this data is to be fed into GPU as attributes.
    this.normals = [];
    this.indices = [];
    this.products = [];
    this.transformations = [];
    this.styleIndices = [];
    this.states = []; // This is the only array we need to keep alive on client side to be able to change appearance of the model.
    this.numProducts = 0;
    //these will be sent to GPU as the textures
    this.vertices = [];
    this.matrices = [];
    this.styles = [];
    this.meter = 1000;
    /*
     * This will be used to change appearance of the objects.
     * Map objects have a format:
     * map = {
     *  productID: int,
    *	type: int,
    *	bBox: Float32Array(6),
    *	spans: [Int32Array([int, int]),Int32Array([int, int]), ...] // Spanning indexes defining shapes of the product and its state.
    *  };
    */
    this.productMap = {};
}
xModelGeometry.prototype.parse = function (binReader) {
    var productShapes = [];
    var br = binReader;
    var magicNumber = br.readInt32();
    if (magicNumber != 94132117)
        throw 'Magic number mismatch.';
    var version = br.readByte();
    var numShapes = br.readInt32();
    var numVertices = br.readInt32();
    var numTriangles = br.readInt32();
    var numMatrices = br.readInt32();
    var numProducts = br.readInt32();
    this.numProducts = numProducts;
    var numStyles = br.readInt32();
    this.meter = br.readFloat32();
    var numRegions = br.readInt16();
    var square = function (arity, count) {
        if (typeof (arity) == 'undefined' || typeof (count) == 'undefined')
            throw 'Wrong arguments';
        if (count == 0)
            return 0;
        var byteLength = count * arity;
        var imgSide = Math.ceil(Math.sqrt(byteLength / 4));
        /* Clamp to arity. */
        while ((imgSide * 4) % arity != 0)
            imgSide++;
        var result = imgSide * imgSide * 4 / arity;
        return result;
    };
    /* Create target buffers of the correct size to avoid reallocation of memory. */
    this.vertices = new Float32Array(square(4, numVertices * 3));
    this.normals = new Uint8Array(numTriangles * 6);
    this.indices = new Float32Array(numTriangles * 3);
    this.styleIndices = new Uint16Array(numTriangles * 3);
    this.styles = new Uint8Array(square(1, numStyles * 4));
    this.products = new Float32Array(numTriangles * 3);
    this.states = new Uint8Array(numTriangles * 3 * 2);
    this.transformations = new Float32Array(numTriangles * 3);
    this.matrices = new Float32Array(square(4, numMatrices * 16));
    this.productMap = {};
    this.regions = new Array(numRegions);
    var iVertex = 0;
    var iIndexForward = 0;
    var iIndexBackward = numTriangles * 3;
    var iTransform = 0;
    var iMatrix = 0;
    var stateEnum = xState;
    var typeEnum = xProductType;
    for (var i = 0; i < numRegions; i++) {
        this.regions[i] =
            {
                population: br.readInt32(),
                centre: br.readFloat32(3),
                bbox: br.readFloat32(6)
            };
    }
    var styleMap = [];
    styleMap.getStyle = function (id) {
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            if (item.id == id)
                return item;
        }
        return null;
    };
    for (var iStyle = 0; iStyle < numStyles; iStyle++) {
        var styleId = br.readInt32();
        var R = br.readFloat32() * 255;
        var G = br.readFloat32() * 255;
        var B = br.readFloat32() * 255;
        var A = br.readFloat32() * 255;
        this.styles.set([R, G, B, A], iStyle * 4);
        styleMap.push({
            id: styleId,
            index: iStyle,
            transparent: A < 254
        });
    }
    for (var i = 0; i < numProducts; i++) {
        var productLabel = br.readInt32();
        var prodType = br.readInt16();
        var bBox = br.readFloat32(6);
        var map = {
            productID: productLabel,
            type: prodType,
            bBox: bBox,
            spans: []
        };
        this.productMap[productLabel] = map;
    }
    for (var iShape = 0; iShape < numShapes; iShape++) {
        var repetition = br.readInt32();
        var shapeList = [];
        for (var iProduct = 0; iProduct < repetition; iProduct++) {
            var prodLabel = br.readInt32();
            var instanceTypeId = br.readInt16();
            var instanceLabel = br.readInt32();
            var styleId = br.readInt32();
            var transformation = null;
            if (repetition > 1) {
                transformation = version === 1 ? br.readFloat32(16) : br.readFloat64(16);
                this.matrices.set(transformation, iMatrix);
                iMatrix += 16;
            }
            var styleItem = styleMap.getStyle(styleId);
            if (styleItem === null)
                throw 'Style index not found.';
            shapeList.push({
                pLabel: prodLabel,
                iLabel: instanceLabel,
                style: styleItem.index,
                transparent: styleItem.transparent,
                transform: transformation != null ? iTransform++ : 0xFFFF
            });
        }
        /* Read shape geometry. */
        var shapeGeom = new xTriangulatedShape();
        shapeGeom.parse(br);
        /* Copy shape data into the inner array and set to null so it can be garbage collected. */
        for (var si in shapeList) {
            var shape = shapeList[si];
            var iIndex = 0;
            /* Set iIndex according to transparency either at the beginning or at the end. */
            if (shape.transparent)
                iIndex = (iIndexBackward - shapeGeom.indices.length);
            else
                iIndex = iIndexForward;
            var begin = iIndex;
            var map = this.productMap[shape.pLabel];
            if (typeof (map) === "undefined") {
                map =
                    {
                        productID: 0,
                        type: typeEnum.IFCOPENINGELEMENT,
                        bBox: new Float32Array(6),
                        spans: []
                    };
                this.productMap[shape.pLabel] = map;
            }
            this.normals.set(shapeGeom.normals, iIndex * 2);
            /* Switch spaces and openings off by default. */
            var state = map.type == typeEnum.IFCSPACE || map.type == typeEnum.IFCOPENINGELEMENT ?
                stateEnum.HIDDEN : 0xFF; //0xFF is for the default state
            /* Fix indices to right absolute position. It is relative to the shape. */
            for (var i = 0; i < shapeGeom.indices.length; i++) {
                var value = shapeGeom.indices[i] + iVertex / 3;
                this.indices[iIndex] = shapeGeom.indices[i] + iVertex / 3;
                this.products[iIndex] = shape.pLabel;
                this.styleIndices[iIndex] = shape.style;
                this.transformations[iIndex] = shape.transform;
                this.states[2 * iIndex] = state; // Set state.
                this.states[2 * iIndex + 1] = 0xFF; // Default style.
                iIndex++;
            }
            var end = iIndex;
            map.spans.push(new Int32Array([begin, end]));
            if (shape.transparent)
                iIndexBackward -= shapeGeom.indices.length;
            else
                iIndexForward += shapeGeom.indices.length;
        }
        /* Copy the geometry and keep track of its amount so that we can fix indices to right position. */
        this.vertices.set(shapeGeom.vertices, iVertex);
        iVertex += shapeGeom.vertices.length;
        productShapes.push(shapeGeom);
        shapeGeom = null;
    }
    /* The binary reader should be at the end of the stream by now. */
    if (!br.getIsEOF())
        ;
    return productShapes;
};
// Source has to be either an URL to a wexBIM file or a blob representing a wexBIM file.
xModelGeometry.prototype.load = function (source) {
    var br = new xBinaryReader();
    var self = this;
    br.onloaded = function () {
        var parsedShapes = self.parse(br);
        if (self.onloaded)
            self.onloaded(parsedShapes);
    };
    br.onerror = function (msg) {
        if (self.onerror)
            self.onerror(msg);
    };
    br.load(source);
};
xModelGeometry.prototype.onloaded = function () { };
xModelGeometry.prototype.onerror = function () { };

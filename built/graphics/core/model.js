var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var Model = (function () {
                function Model(renderables, transform, parent) {
                    this.renderables = renderables;
                    this.transform = transform;
                    this.parent = null;
                    this.children = [];
                    if (Model._currentModelID == undefined)
                        Model._currentModelID = 1;
                    this.modelID = Model._currentModelID++;
                }
                ;
                return Model;
            }());
            core.Model = Model;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

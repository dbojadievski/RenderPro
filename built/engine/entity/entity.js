var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var Entity = (function () {
            function Entity(tag, parent) {
                if (parent === void 0) { parent = null; }
                Application.Debug.assert(isValidReference(tag) && tag.length != 0);
                this.m_tag = tag.trim();
                this.m_parent = parent;
                this.m_children = new Array();
                this.m_components = new Dictionary();
                this.m_id = ++Entity.s_id;
            }
            Entity.prototype.hasChild = function (tag) {
                Application.Debug.assert(isValidReference(tag) && tag.length > 0);
                var hasChild = false;
                if (isValidReference(tag)) {
                    var trimmedTag = tag.trim();
                    for (var i = 0; i < this.m_children.length; i++) {
                        var child = this.m_children[i];
                        if (child.m_tag == trimmedTag) {
                            hasChild = true;
                            break;
                        }
                    }
                }
                return hasChild;
            };
            return Entity;
        }());
        Entity.s_id = 0;
        core.Entity = Entity;
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

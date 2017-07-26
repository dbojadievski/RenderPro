var renderPro;
(function (renderPro) {
    var core;
    (function (core) {
        var systems;
        (function (systems) {
            var EntitySystem = (function () {
                function EntitySystem(eventSystem) {
                    this.m_eventSystem = eventSystem;
                    this.m_entities = new Dictionary();
                }
                EntitySystem.prototype.init = function () {
                    var self = this;
                    this.m_eventSystem.on('shouldCreateEntity', function (tag) {
                        self.createEntity(tag);
                    });
                };
                EntitySystem.prototype.update = function () {
                };
                EntitySystem.prototype.find = function (tag) {
                    Application.Debug.assert(isValidReference(tag) && tag.length != 0);
                    var entity = null;
                    if (isValidReference(tag)) {
                        var trimmedTag = tag.trim();
                        entity = this.m_entities.getByKey(trimmedTag);
                    }
                    return entity;
                };
                EntitySystem.prototype.exists = function (tag) {
                    var doesExist = this.m_entities.hasKey(tag);
                    return doesExist;
                };
                EntitySystem.prototype.createEntity = function (tag) {
                    var entity = null;
                    var doesExist = this.m_entities.hasKey(tag);
                    if (!doesExist)
                        entity = new renderPro.core.Entity(tag);
                    return entity;
                };
                EntitySystem.prototype.attach = function (parent, child) {
                    Application.Debug.assert(isValidReference(child));
                    Application.Debug.assert(isValidReference(parent));
                    if (isValidReference(parent) && isValidReference(child)) {
                        var hasChild = parent.hasChild(child.m_tag);
                        if (!hasChild) {
                            parent.m_children.push(child);
                            child.m_parent = parent;
                        }
                    }
                };
                EntitySystem.prototype.attachByTag = function (parentTag, childTag) {
                    Application.Debug.assert(isValidReference(parent) && parent.length != 0);
                    Application.Debug.assert(isValidReference(childTag) && childTag.length != 0);
                    if (isValidReference(parentTag) && isValidReference(parentTag)) {
                        var trimmedChildTag = childTag.trim();
                        var trimmedParentTag = parentTag.trim();
                        if (trimmedChildTag.length != 0 && trimmedParentTag.length != 0) {
                            var child = this.find(trimmedChildTag);
                            var parent_1 = this.find(trimmedParentTag);
                            this.attach(parent_1, child);
                        }
                    }
                };
                EntitySystem.prototype.detach = function (parent, child) {
                    Application.Debug.assert(isValidReference(child));
                    Application.Debug.assert(isValidReference(parent));
                    if (isValidReference(parent) && isValidReference(child)) {
                        var idx = parent.m_children.indexOf(child);
                        if (idx != -1)
                            parent.m_children.splice(idx, 1);
                    }
                };
                EntitySystem.prototype.detachByTag = function (parentTag, childTag) {
                    Application.Debug.assert(isValidReference(parent) && parent.length != 0);
                    Application.Debug.assert(isValidReference(childTag) && childTag.length != 0);
                    if (isValidReference(parentTag) && isValidReference(parentTag)) {
                        var trimmedChildTag = childTag.trim();
                        var trimmedParentTag = parentTag.trim();
                        if (trimmedChildTag.length != 0 && trimmedParentTag.length != 0) {
                            var child = this.find(trimmedChildTag);
                            var parent_2 = this.find(trimmedParentTag);
                            this.detach(parent_2, child);
                        }
                    }
                };
                return EntitySystem;
            }());
            systems.EntitySystem = EntitySystem;
        })(systems = core.systems || (core.systems = {}));
    })(core = renderPro.core || (renderPro.core = {}));
})(renderPro || (renderPro = {}));

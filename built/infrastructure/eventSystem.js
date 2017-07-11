var Application;
(function (Application) {
    var Infrastructure;
    (function (Infrastructure) {
        var ProEventSystem = (function () {
            function ProEventSystem() {
                this._events = new Array();
            }
            ProEventSystem.prototype.on = function (event, handler) {
                if (!this._events[event])
                    this._events[event] = new Array();
                this._events[event].push(handler);
            };
            ProEventSystem.prototype.fire = function (event, args) {
                if (args === void 0) { args = undefined; }
                var handlers = this._events[event];
                if (handlers) {
                    for (var handler in handlers) {
                        var h = handlers[handler];
                        h(args);
                    }
                }
            };
            ProEventSystem.prototype.fireOA = function (event, args) {
                var handlers = this._events[event];
                if (handlers) {
                    for (var handler in handlers) {
                        var h = handlers[handler];
                        h(args);
                    }
                }
            };
            ProEventSystem.prototype.fireVA = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var handlers = this._events[event];
                if (handlers) {
                    for (var handler in handlers)
                        handlers[handler](args);
                }
            };
            ProEventSystem.prototype.disconnect = function (event, handler) {
                var handlers = this._events[event];
                if (handlers) {
                    var index = handlers.indexOf(handler);
                    if (index >= 0) {
                        handlers.splice(index, 1);
                    }
                }
            };
            ProEventSystem.prototype.init = function () { };
            ProEventSystem.prototype.update = function () { };
            return ProEventSystem;
        }());
        Infrastructure.ProEventSystem = ProEventSystem;
    })(Infrastructure = Application.Infrastructure || (Application.Infrastructure = {}));
})(Application || (Application = {}));

var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var core;
        (function (core) {
            var State;
            (function (State) {
                State[State["NORMAL"] = 0] = "NORMAL";
                State[State["TRANSPARENT"] = 1] = "TRANSPARENT";
                State[State["HIGHLIGHTED"] = 2] = "HIGHLIGHTED";
                State[State["HIDDEN"] = 3] = "HIDDEN";
            })(State = core.State || (core.State = {}));
            ;
        })(core = graphics.core || (graphics.core = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));

var Application;
(function (Application) {
    var Debug;
    (function (Debug) {
        function assert(expression, message) {
            if (Debug.IS_DEBUGGING_ENABLED && !expression)
                throw message !== undefined ? message : "ASSERTION INVALID; TERMINATING EXECUTION.";
        }
        Debug.assert = assert;
    })(Debug = Application.Debug || (Application.Debug = {}));
})(Application || (Application = {}));

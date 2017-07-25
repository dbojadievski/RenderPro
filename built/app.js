var Application;
(function (Application) {
    var Debug;
    (function (Debug) {
        Debug.IS_DEBUGGING_ENABLED = false;
    })(Debug = Application.Debug || (Application.Debug = {}));
    var Environment;
    (function (Environment) {
        var Path;
        (function (Path) {
            Path.Assets = "assets\\";
            Path.Materials = Application.Environment.Path.Assets + "materials\\";
            Path.Textures = Application.Environment.Path.Assets + "textures\\";
        })(Path = Environment.Path || (Environment.Path = {}));
    })(Environment = Application.Environment || (Application.Environment = {}));
    var Systems;
    (function (Systems) {
        Systems.eventSystem = new Application.Infrastructure.ProEventSystem();
        Systems.console = new Application.Infrastructure.CommandConsole.Console(Systems.eventSystem);
    })(Systems = Application.Systems || (Application.Systems = {}));
})(Application || (Application = {}));

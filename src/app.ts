namespace Application {
    export namespace Debug {
        export const IS_DEBUGGING_ENABLED : boolean = false;
    }
    export namespace Environment {
        export namespace Path {
            export const Assets : string        = "assets\\"
            export const Materials : string     = Application.Environment.Path.Assets + "materials\\";
            export const Textures : string      = Application.Environment.Path.Assets + "textures\\";
        }
    }
    export namespace Systems {
        export let eventSystem  = new Application.Infrastructure.ProEventSystem ( );
        export let console      = new Application.Infrastructure.CommandConsole.Console ( eventSystem );
    }
}
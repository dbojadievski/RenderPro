namespace Application {
    export namespace Debug {}
    export namespace Environment {
        export namespace Path {
            export const Assets : string        = "assets\\"
            export const Materials : string     = Application.Environment.Path.Assets + "materials\\";
            export const Textures : string      = Application.Environment.Path.Assets + "textures\\";
        }
    }
}
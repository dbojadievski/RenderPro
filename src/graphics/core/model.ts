namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Model {
                renderables : Array<renderPro.graphics.gl.IRenderable>
                transform : Float32Array
                parent : Model
                children : Array<Model>
                modelID : number
                name: string
                static _currentModelID : number
                constructor( renderables : Array<renderPro.graphics.gl.IRenderable>, transform : Float32Array, parent : Model, name: string )
                {
                    this.renderables            = renderables;
                    this.transform              = transform;
                    
                    this.name                   = name;

                    this.parent                 = null;
                    this.children               = [ ];
                    if ( Model._currentModelID == undefined )
                        Model._currentModelID   = 1;
                    
                    this.modelID                = Model._currentModelID++;
                };
            }
        }
    }
}
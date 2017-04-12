namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Model {
                renderables : Array<renderPro.graphics.gl.Renderable> // TODO: make renderable 
                transform : Float32Array
                parent : Model
                children : Array<Model>
                modelID : number
                static _currentModelID : number
                constructor( renderables : Array<renderPro.graphics.gl.Renderable>, transform : Float32Array, parent : Model )
                {
                    this.renderables            = renderables;
                    this.transform              = transform;
                    
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
namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Effect {
                vertexShaderId: number
                fragmentShaderId: number
                name: String
                innerEffect: renderPro.graphics.gl.Effect
                static currentEffectIdx: number
                effectID: number
                constructor ( name: String, vertexShaderObject : any, fragmentShaderObject: any ) {
                    this.vertexShaderId = vertexShaderObject.id;
                    this.fragmentShaderId = fragmentShaderObject.id;
                    this.name = name;
                    this.innerEffect = new renderPro.graphics.gl.Effect(vertexShaderObject, fragmentShaderObject);

                    if ( Effect.currentEffectIdx == undefined )
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;

                    this.effectID               = Effect.currentEffectIdx;
                }
                use () : void {
                    this.innerEffect.use();
                }
            }
        }
    }
}
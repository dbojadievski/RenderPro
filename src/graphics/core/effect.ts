namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Effect {
                name: String
                innerEffect: renderPro.graphics.gl.Effect
                static currentEffectIdx: number
                effectID: number
                constructor ( name: String ) {
                    this.name               = name;
                    this.innerEffect        = new renderPro.graphics.gl.Effect();

                    if ( Effect.currentEffectIdx == undefined )
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;

                    this.effectID               = Effect.currentEffectIdx;
                }
                load (vertexShaderObject : any, fragmentShaderObject: any) {
                    this.innerEffect.load(vertexShaderObject, fragmentShaderObject);
                }
                use () : void {
                    this.innerEffect.use();
                }
            }
        }
    }
}